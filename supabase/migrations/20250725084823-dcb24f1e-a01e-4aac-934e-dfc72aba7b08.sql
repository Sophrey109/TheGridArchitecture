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

-- Create a trigger that automatically deactivates jobs when they're accessed if deadline has passed
CREATE OR REPLACE FUNCTION public.auto_deactivate_on_update()
RETURNS trigger AS $$
BEGIN
  -- If deadline has passed, set is_active to false
  IF NEW.deadline IS NOT NULL AND NEW.deadline < CURRENT_DATE THEN
    NEW.is_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for UPDATE operations
CREATE OR REPLACE TRIGGER trigger_auto_deactivate_jobs
  BEFORE UPDATE ON public."Job Adverts"
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_deactivate_on_update();

-- Create trigger for INSERT operations to prevent inserting expired jobs as active
CREATE OR REPLACE TRIGGER trigger_auto_deactivate_jobs_insert
  BEFORE INSERT ON public."Job Adverts"
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_deactivate_on_update();