-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT
);

-- Create repositories table
CREATE TABLE repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  default_branch TEXT DEFAULT 'main' NOT NULL,
  is_private BOOLEAN DEFAULT false NOT NULL,
  storage_path TEXT,
  total_size BIGINT DEFAULT 0 NOT NULL
);

-- Create documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  repository_id UUID REFERENCES repositories ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT DEFAULT 'document' NOT NULL,
  current_version UUID,
  parent_version UUID,
  mime_type TEXT DEFAULT 'text/plain' NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Create versions table
CREATE TABLE versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  document_id UUID REFERENCES documents ON DELETE CASCADE NOT NULL,
  content TEXT,
  version_hash TEXT NOT NULL,
  commit_message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  parent_version UUID REFERENCES versions(id),
  branch TEXT DEFAULT 'main' NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- Create branches table
CREATE TABLE branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  repository_id UUID REFERENCES repositories ON DELETE CASCADE NOT NULL,
  latest_commit UUID REFERENCES versions(id),
  is_default BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(repository_id, name)
);

-- Add foreign key constraints for version references
ALTER TABLE documents 
  ADD CONSTRAINT fk_current_version 
  FOREIGN KEY (current_version) 
  REFERENCES versions(id);

ALTER TABLE documents 
  ADD CONSTRAINT fk_parent_version 
  FOREIGN KEY (parent_version) 
  REFERENCES versions(id);

-- Create indexes for better query performance
CREATE INDEX idx_documents_repository_id ON documents(repository_id);
CREATE INDEX idx_versions_document_id ON versions(document_id);
CREATE INDEX idx_versions_parent_version ON versions(parent_version);
CREATE INDEX idx_branches_repository_id ON branches(repository_id);
CREATE INDEX idx_repositories_user_id ON repositories(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for documents table
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 