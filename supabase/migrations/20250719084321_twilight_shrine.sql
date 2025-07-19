/*
  # Create storage buckets for KickStartX

  1. Storage Buckets
    - `audio-recordings` - for user intent voice recordings
    - `content-files` - for uploaded PDFs and other study materials

  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated users to manage their own files
*/

-- Create audio recordings bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Create content files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-files', 'content-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for audio recordings - users can upload their own files
CREATE POLICY "Users can upload own audio recordings"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'audio-recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for audio recordings - users can read their own files
CREATE POLICY "Users can read own audio recordings"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audio-recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for audio recordings - users can delete their own files
CREATE POLICY "Users can delete own audio recordings"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'audio-recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for content files - users can upload their own files
CREATE POLICY "Users can upload own content files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'content-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for content files - users can read their own files
CREATE POLICY "Users can read own content files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'content-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for content files - users can delete their own files
CREATE POLICY "Users can delete own content files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'content-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );