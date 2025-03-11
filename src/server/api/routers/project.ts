import { pollCommits } from '@/lib/github';
import { createTRPCRouter, protectedProcedure} from '../trpc'
import { z } from "zod";
import { indexGithubRepo } from '@/lib/github-loader';
import { TRPCError } from '@trpc/server';

export const projectRouter = createTRPCRouter({
    createProtect: protectedProcedure.input(
        z.object({
            name: z.string().min(1, 'Project name is required'),
            githubUrl: z.string().url('Invalid URL').regex(
                /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/,
                'Invalid GitHub repository URL format. Expected format: https://github.com/owner/repo'
            ),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ ctx, input }) => {
        try {
            // Verify that the user exists
            const userId = ctx.user.userId;
            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated'
                });
            }

            // Verify that the user exists in the database
            const user = await ctx.db.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found. Please sign up first.'
                });
            }

            // Check if project with same GitHub URL already exists
            const existingProject = await ctx.db.project.findFirst({
                where: {
                    githubUrl: input.githubUrl,
                    userToProjects: {
                        some: {
                            userId: userId
                        }
                    },
                    deletedAt: null
                }
            });

            if (existingProject) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'A project with this GitHub URL already exists'
                });
            }

            // Create the project with a transaction to ensure consistency
            const project = await ctx.db.$transaction(async (tx) => {
                // Create the project first
                const newProject = await tx.project.create({
                    data: {
                        githubUrl: input.githubUrl,
                        name: input.name,
                    },
                });
                
                // Then create the user-project relation
                await tx.userToProject.create({
                    data: {
                        userId: userId,
                        projectId: newProject.id,
                    }
                });
                
                return newProject;
            });

            // Index the repository
            try {
                await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
            } catch (error) {
                // If indexing fails, clean up the project and its relations
                await ctx.db.$transaction(async (tx) => {
                    // Delete associated records first
                    await tx.sourceCodeEmbedding.deleteMany({
                        where: { projectId: project.id }
                    });
                    await tx.userToProject.deleteMany({
                        where: { projectId: project.id }
                    });
                    await tx.commit.deleteMany({
                        where: { projectId: project.id }
                    });
                    await tx.question.deleteMany({
                        where: { projectId: project.id }
                    });
                    // Finally delete the project
                    await tx.project.delete({
                        where: { id: project.id }
                    });
                });
                throw error;
            }

            // Poll commits
            try {
                await pollCommits(project.id);
            } catch (error) {
                console.error('Error polling commits:', error);
                // Don't fail the project creation if commit polling fails
            }

            return project;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            
            if (error instanceof Error) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: error.message
                });
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred while creating the project'
            });
        }
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.user.userId;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not authenticated'
            });
        }
        
        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: {
                        userId: userId
                    },
                },
                deletedAt: null
            },
        });
    }),
    getCommits: protectedProcedure.input(z.object({  
        projectId: z.string()  
    })).query(async ({ ctx, input }) => {
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({ where: { projectId: input.projectId } })  
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any()
    })).mutation(async ({ ctx, input }) => {
        const userId = ctx.user.userId;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not authenticated'
            });
        }
        
        return await ctx.db.question.create({
          data: {
            answer: input.answer,
            filesReferences: input.filesReferences,
            projectId: input.projectId,
            question: input.question,
            userId: userId
          }
        });
    }),
    deleteProject: protectedProcedure.input(
        z.object({
            projectId: z.string()
        })
    ).mutation(async ({ ctx, input }) => {
        const userId = ctx.user.userId;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User not authenticated'
            });
        }
        
        // First check if the user has access to this project
        const project = await ctx.db.project.findFirst({
            where: {
                id: input.projectId,
                userToProjects: {
                    some: {
                        userId: userId
                    }
                },
                deletedAt: null
            }
        });

        if (!project) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Project not found or you do not have permission to delete it'
            });
        }

        // Soft delete by setting deletedAt field
        return await ctx.db.project.update({
            where: {
                id: input.projectId
            },
            data: {
                deletedAt: new Date()
            }
        });
    })
});