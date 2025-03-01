import { supabase } from './supabase'
import { createHash } from 'crypto'

// Generate a hash for version control
const generateHash = (content: string): string => {
  return createHash('sha1').update(content).digest('hex')
}

// Create a new branch
export const createBranch = async (
  repositoryId: string,
  branchName: string,
  isDefault: boolean = false
) => {
  const { data, error } = await supabase
    .from('branches')
    .insert([
      {
        name: branchName,
        repository_id: repositoryId,
        is_default: isDefault
      }
    ])
    .select()
    .single()

  return { data, error }
}

// Commit changes to a document
export const commitDocument = async (
  documentId: string,
  content: string,
  commitMessage: string,
  userId: string,
  branch: string = 'main'
) => {
  const versionHash = generateHash(content)

  // Get the current version of the document
  const { data: currentDoc } = await supabase
    .from('documents')
    .select('current_version')
    .eq('id', documentId)
    .single()

  // Create new version
  const { data: version, error: versionError } = await supabase
    .from('versions')
    .insert([
      {
        document_id: documentId,
        content,
        version_hash: versionHash,
        commit_message: commitMessage,
        user_id: userId,
        parent_version: currentDoc?.current_version || null,
        branch
      }
    ])
    .select()
    .single()

  if (versionError) return { error: versionError }

  // Update document with new version
  const { data, error } = await supabase
    .from('documents')
    .update({
      content,
      current_version: version.id,
      parent_version: currentDoc?.current_version || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', documentId)
    .select()
    .single()

  // Update branch latest commit
  await supabase
    .from('branches')
    .update({ latest_commit: version.id })
    .eq('name', branch)

  return { data, error }
}

// Get version history of a document
export const getVersionHistory = async (documentId: string) => {
  const { data, error } = await supabase
    .from('versions')
    .select(`
      id,
      created_at,
      version_hash,
      commit_message,
      branch,
      user_id,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('document_id', documentId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Get specific version of a document
export const getVersion = async (versionId: string) => {
  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('id', versionId)
    .single()

  return { data, error }
}

// Create a new branch from existing version
export const branchFromVersion = async (
  repositoryId: string,
  versionId: string,
  newBranchName: string
) => {
  // Create new branch
  const { data: branch, error: branchError } = await createBranch(
    repositoryId,
    newBranchName
  )

  if (branchError) return { error: branchError }

  // Update branch with the version as latest commit
  const { data, error } = await supabase
    .from('branches')
    .update({ latest_commit: versionId })
    .eq('id', branch.id)
    .select()
    .single()

  return { data, error }
}

// Merge changes from one branch to another
export const mergeBranches = async (
  repositoryId: string,
  sourceBranch: string,
  targetBranch: string,
  userId: string
) => {
  // Get latest commits from both branches
  const { data: branches } = await supabase
    .from('branches')
    .select('latest_commit')
    .in('name', [sourceBranch, targetBranch])
    .eq('repository_id', repositoryId)

  if (!branches || branches.length !== 2) {
    return { error: new Error('Branches not found') }
  }

  // Get the documents that need to be merged
  const { data: sourceVersions } = await supabase
    .from('versions')
    .select('document_id, content')
    .eq('branch', sourceBranch)
    .order('created_at', { ascending: false })

  if (!sourceVersions) return { error: new Error('No versions found') }

  // For each document, create a new version in the target branch
  const mergeResults = await Promise.all(
    sourceVersions.map(async (version) => {
      return commitDocument(
        version.document_id,
        version.content,
        `Merged changes from ${sourceBranch} into ${targetBranch}`,
        userId,
        targetBranch
      )
    })
  )

  return { data: mergeResults, error: null }
}

// Get all branches for a repository
export const getBranches = async (repositoryId: string) => {
  const { data, error } = await supabase
    .from('branches')
    .select(`
      *,
      versions (
        id,
        commit_message,
        created_at,
        user_id,
        profiles (
          username,
          avatar_url
        )
      )
    `)
    .eq('repository_id', repositoryId)
    .order('created_at', { ascending: false })

  return { data, error }
} 