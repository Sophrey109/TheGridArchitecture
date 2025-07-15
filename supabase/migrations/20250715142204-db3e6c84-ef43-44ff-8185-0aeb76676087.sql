-- Add tags column to Articles table (case-sensitive table name)
ALTER TABLE public."Articles" 
ADD COLUMN tags TEXT[];