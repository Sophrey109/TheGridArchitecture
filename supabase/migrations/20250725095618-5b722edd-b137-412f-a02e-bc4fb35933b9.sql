-- Add currency column to Job Adverts table
ALTER TABLE public."Job Adverts" 
ADD COLUMN currency text DEFAULT 'USD';