-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.deactivate_expired_jobs()
RETURNS void 
SET search_path = public
AS $$
BEGIN
  UPDATE public."Job Adverts"
  SET is_active = false
  WHERE deadline < CURRENT_DATE 
  AND is_active = true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.auto_deactivate_on_update()
RETURNS trigger 
SET search_path = public
AS $$
BEGIN
  -- If deadline has passed, set is_active to false
  IF NEW.deadline IS NOT NULL AND NEW.deadline < CURRENT_DATE THEN
    NEW.is_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;