'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Github } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import useRefetch from '@/hooks/use-refetch';
import { useRouter } from 'next/navigation';

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormInput>();
  const createProject = api.project.createProtect.useMutation();
  const refetch = useRefetch();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  
  async function onSubmit(data: FormInput) {
    try {
      setIsCreating(true);
      
      // Validate URL format
      if (!data.repoUrl.startsWith('https://github.com/')) {
        toast.error('Please enter a valid GitHub repository URL');
        setIsCreating(false);
        return false;
      }
      
      await createProject.mutateAsync({
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken || undefined
      });
      
      toast.success('Project created successfully');
      await refetch();
      reset();
      
      // Navigate back to dashboard after successful creation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
      return false;
    } finally {
      setIsCreating(false);
    }
  }
  
  return (
    <div className="h-full overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side with image and gradient overlay */}
          <div className="relative md:w-2/5 w-full h-64 md:h-auto">
            {/* Background image with subtle zoom on hover */}
            <img
              src="logo.jpeg"
              alt="Background"
              className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-700/70 to-blue-700/70 flex flex-col items-center justify-center">
              <img
                src="logo.jpeg"
                className="w-20 h-20 rounded-full shadow-lg border-4 border-white/30 mb-4 transition-transform duration-300 hover:scale-110 hover:shadow-purple-500/30"
                alt="Logo"
              />
              <h2 className="text-xl font-bold text-white text-center">Welcome to StackAlchemy</h2>
              <p className="mt-1 text-white/80 text-center text-sm">
                Transform your repository into something magical
              </p>
            </div>
          </div>

          {/* Right side with form */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <CardHeader className="mb-6">
              <CardTitle className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Github className="h-6 w-6" />
                Link your GitHub Repository
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter your repository details to get started with StackAlchemy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    {...register('projectName', { required: true })}
                    placeholder="My Awesome Project"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isCreating}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="repoURL">GitHub Repository URL</Label>
                  <Input
                    id="repoURL"
                    {...register('repoUrl', { required: true })}
                    placeholder="https://github.com/username/repo"
                    type="url"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isCreating}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="githubToken">GitHub Token (Optional)</Label>
                  <Input
                    id="githubToken"
                    {...register('githubToken')}
                    placeholder="ghp_xxxxxxxxxxxx"
                    type="password"
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                    disabled={isCreating}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Used for private repositories. We'll securely store your token.
                  </p>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={isCreating || isSubmitting || createProject.isPending}
                >
                  {isCreating ? 'Creating Project...' : 'Create Project'}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreatePage;
