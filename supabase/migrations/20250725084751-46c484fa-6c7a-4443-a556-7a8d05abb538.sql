-- Add deadline column to Job Adverts table
ALTER TABLE public."Job Adverts" 
ADD COLUMN deadline DATE;

-- Create function to automatically deactivate expired jobs
CREATE OR REPLACE FUNCTION public.deactivate_expired_jobs()
RETURNS void AS $$
BEGIN
  UPDATE public."Job Adverts"
  SET is_active = false
  WHERE deadline < CURRENT_DATE 
  AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function that runs on SELECT to ensure expired jobs are deactivated
CREATE OR REPLACE FUNCTION public.check_job_expiry()
RETURNS trigger AS $$
BEGIN
  -- Deactivate any expired jobs before returning results
  PERFORM public.deactivate_expired_jobs();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that runs the expiry check on SELECT operations
CREATE OR REPLACE TRIGGER trigger_check_job_expiry
  BEFORE SELECT ON public."Job Adverts"
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.check_job_expiry();