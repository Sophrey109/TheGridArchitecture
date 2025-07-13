-- Enable public read access to job listings
CREATE POLICY "Allow public read access to job adverts" 
ON public."Job Adverts" 
FOR SELECT 
USING (true);