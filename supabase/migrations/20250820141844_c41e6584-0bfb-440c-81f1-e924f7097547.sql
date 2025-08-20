-- Add UPDATE policy for Articles table to allow authenticated users to update articles
CREATE POLICY "Allow authenticated users to update articles" 
ON public."Articles" 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');