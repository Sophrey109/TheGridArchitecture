-- Phase 2: Database Security Hardening

-- Make user_id columns non-nullable for security
-- This ensures RLS policies always have a valid user context

-- Update questions table to make user_id non-nullable
ALTER TABLE public.questions 
ALTER COLUMN user_id SET NOT NULL;

-- Update answers table to make user_id non-nullable  
ALTER TABLE public.answers
ALTER COLUMN user_id SET NOT NULL;

-- Add proper foreign key constraints to ensure data integrity
-- Note: We reference auth.users which is the Supabase auth table
ALTER TABLE public.questions
ADD CONSTRAINT questions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.answers  
ADD CONSTRAINT answers_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key constraint for answers to questions relationship
ALTER TABLE public.answers
ADD CONSTRAINT answers_question_id_fkey
FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;

-- Add indexes for better performance on user-specific queries
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON public.answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);

-- Add constraint to ensure only approved questions can have answers
CREATE OR REPLACE FUNCTION check_question_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT status FROM public.questions WHERE id = NEW.question_id) != 'approved' THEN
    RAISE EXCEPTION 'Cannot add answer to non-approved question';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_question_approved_before_answer
  BEFORE INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION check_question_approved();