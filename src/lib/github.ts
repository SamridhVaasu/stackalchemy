import { Octokit } from 'octokit';
import { db } from "@/server/db";
import { aiSummariseCommit } from './gemini';


export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true
    }
  });
  
  if (!project?.githubUrl) {
    throw new Error('Project not found');
  }

  return { githubUrl: project.githubUrl };
}

async function getCommitHashes(githubUrl: string): Promise<Response[]> {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid Github URL');
  }
  
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 10
  });
  
  return data.map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? ""
  }));
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {  
  const processedCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true }
  });

  return commitHashes.filter(
    (commit) => !processedCommits.some(
      (processed) => processed.commitHash === commit.commitHash
    )
  );
}

async function summariseCommit(githubUrl: string, commitHash: string) {
  const [owner, repo] = githubUrl.split('/').slice(-2);
  if (!owner || !repo) {
    throw new Error('Invalid Github URL');
  }

  try {
    const { data } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: commitHash,
    });

    const files = data.files || [];
    const diffContent = files.map(file => 
      `File: ${file.filename}\nChanges: ${file.changes}\n${file.patch || ''}`
    ).join('\n\n');

    const summary = await aiSummariseCommit(diffContent);
    return summary;
  } catch (error) {
    console.error('Error getting commit summary:', error);
    return '';
  }
}

export const pollCommits = async (projectId: string) => {  
  // 1. Get project and GitHub URL
  const { githubUrl } = await fetchProjectGithubUrl(projectId);  
  
  // 2. Get latest commits from GitHub
  const commitHashes = await getCommitHashes(githubUrl);  
  
  // 3. Filter out commits we've already processed
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);  

  if (unprocessedCommits.length === 0) {
    return [];
  }

  // 4. Get summaries for new commits
  const summaryPromises = unprocessedCommits.map(commit => 
    summariseCommit(githubUrl, commit.commitHash)
  );

  const summaries = await Promise.allSettled(summaryPromises);

  // 5. Prepare commit data with summaries
  const commitData = unprocessedCommits.map((commit, index) => ({
    projectId,
    commitHash: commit.commitHash,
    commitMessage: commit.commitMessage,
    commitAuthorName: commit.commitAuthorName,
    commitAuthorAvatar: commit.commitAuthorAvatar,
    commitDate: new Date(commit.commitDate),
    summary: summaries[index].status === 'fulfilled' ? summaries[index].value : ''
  }));

  // 6. Save commits in a single transaction
  await db.commit.createMany({
    data: commitData,
    skipDuplicates: true
  });

  return commitData;
};
