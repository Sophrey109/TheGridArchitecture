-- Fix security warnings from linter

-- Fix WARN 1: Function Search Path Mutable
-- Set search_path to empty for security functions to prevent search path attacks
CREATE OR REPLACE FUNCTION check_question_approved()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (SELECT status FROM public.questions WHERE id = NEW.question_id) != 'approved' THEN
    RAISE EXCEPTION 'Cannot add answer to non-approved question';
  END IF;
  RETURN NEW;
END;
$$;

-- Update existing database functions to have secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_deactivate_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If deadline has passed, set is_active to false
  IF NEW.deadline IS NOT NULL AND NEW.deadline < CURRENT_DATE THEN
    NEW.is_active = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.deactivate_expired_jobs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public."Job Adverts"
  SET is_active = false
  WHERE deadline < CURRENT_DATE 
  AND is_active = true;
END;
$$;