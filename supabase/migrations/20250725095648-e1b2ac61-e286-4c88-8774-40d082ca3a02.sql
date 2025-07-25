-- Fix security warning by setting search_path for deactivate_expired_jobs function
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