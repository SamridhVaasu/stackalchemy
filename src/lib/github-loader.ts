import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { generateEmbedding, summariseCode } from './gemini';
import { db } from '@/server/db';

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  try {
    // Validate GitHub URL format
    const urlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!urlPattern.test(githubUrl)) {
      throw new Error('Invalid GitHub repository URL format. Expected format: https://github.com/owner/repo');
    }

    // Extract owner and repo from URL
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if (!owner || !repo) {
      throw new Error('Could not extract owner and repository from URL');
    }

    const loader = new GithubRepoLoader(githubUrl, {
      accessToken: githubToken || '',
      branch: 'main',
      ignoreFiles: [
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'bun.lockb',
        'node_modules/**',
        'dist/**',
        'build/**',
        '.next/**',
        'coverage/**'
      ],
      recursive: true,
      unknown: 'warn',
      maxConcurrency: 5
    });

    const docs = await loader.load();
    if (!docs.length) {
      throw new Error('No files found in the repository. Please check the repository URL and access permissions.');
    }
    return docs;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('Repository not found. Please check the URL and ensure you have access to the repository.');
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Access denied. Please check your GitHub token for private repositories.');
      }
      throw error;
    }
    throw new Error('Failed to load GitHub repository');
  }
};

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
  try {
    console.log(`Starting indexing for project ${projectId} with URL ${githubUrl}`);
    
    const docs = await loadGithubRepo(githubUrl, githubToken);
    console.log(`Loaded ${docs.length} documents from repository`);
    
    const allEmbeddings = await generateEmbeddings(docs);
    console.log(`Generated embeddings for ${allEmbeddings.length} documents`);

    let successCount = 0;
    let errorCount = 0;

    await Promise.all(allEmbeddings.map(async (embedding, index) => {
      try {
        console.log(`Processing document ${index + 1} of ${allEmbeddings.length}`);

        if (!embedding) {
          console.error(`Skipping document ${index + 1} - no embedding generated`);
          errorCount++;
          return;
        }

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
          data: {
            summary: embedding.summary,
            sourceCode: embedding.sourceCode,
            fileName: embedding.fileName,
            projectId,
          }
        });

        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${embedding.embedding}::vector
          WHERE "id" = ${sourceCodeEmbedding.id}
        `;

        successCount++;
      } catch (error) {
        console.error(`Error processing document ${index + 1}:`, error);
        errorCount++;
      }
    }));

    console.log(`Indexing completed - Success: ${successCount}, Errors: ${errorCount}`);

    if (successCount === 0) {
      throw new Error('Failed to index any files from the repository');
    }

    return { successCount, errorCount };
  } catch (error) {
    console.error('Error in indexGithubRepo:', error);
    throw error;
  }
};

const generateEmbeddings = async (docs: Document[]) => {
  const results = await Promise.allSettled(docs.map(async doc => {
    try {
      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    } catch (error) {
      console.error('Error generating embedding for document:', error);
      return null;
    }
  }));

  return results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled' && result.value !== null)
    .map(result => result.value);
};