-- Enable RLS on all tables
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Repositories policies
CREATE POLICY "Users can view their own repositories"
ON repositories FOR SELECT
USING (
  auth.uid() = user_id
  OR
  is_private = false
);

CREATE POLICY "Users can create repositories"
ON repositories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repositories"
ON repositories FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own repositories"
ON repositories FOR DELETE
USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view documents in accessible repositories"
ON documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = documents.repository_id
    AND (
      repositories.user_id = auth.uid()
      OR
      repositories.is_private = false
    )
  )
);

CREATE POLICY "Users can create documents in their repositories"
ON documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update documents in their repositories"
ON documents FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete documents in their repositories"
ON documents FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
);

-- Versions policies
CREATE POLICY "Users can view versions of accessible documents"
ON versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM documents
    JOIN repositories ON repositories.id = documents.repository_id
    WHERE documents.id = versions.document_id
    AND (
      repositories.user_id = auth.uid()
      OR
      repositories.is_private = false
    )
  )
);

CREATE POLICY "Users can create versions in their repositories"
ON versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM documents
    JOIN repositories ON repositories.id = documents.repository_id
    WHERE documents.id = document_id
    AND repositories.user_id = auth.uid()
  )
);

-- Branches policies
CREATE POLICY "Users can view branches of accessible repositories"
ON branches FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND (
      repositories.user_id = auth.uid()
      OR
      repositories.is_private = false
    )
  )
);

CREATE POLICY "Users can create branches in their repositories"
ON branches FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update branches in their repositories"
ON branches FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete branches in their repositories"
ON branches FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM repositories
    WHERE repositories.id = repository_id
    AND repositories.user_id = auth.uid()
  )
); 