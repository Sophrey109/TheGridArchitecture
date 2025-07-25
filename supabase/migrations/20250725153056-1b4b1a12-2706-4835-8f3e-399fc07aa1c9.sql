-- Phase 2: Database Security Hardening (Fixed)

-- Make user_id columns non-nullable for security (if not already)
DO $$ 
BEGIN
  -- Update questions table to make user_id non-nullable
  BEGIN
    ALTER TABLE public.questions 
    ALTER COLUMN user_id SET NOT NULL;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'user_id column in questions is already non-nullable or update failed: %', SQLERRM;
  END;

  -- Update answers table to make user_id non-nullable  
  BEGIN
    ALTER TABLE public.answers
    ALTER COLUMN user_id SET NOT NULL;
  EXCEPTION 
    WHEN others THEN 
      RAISE NOTICE 'user_id column in answers is already non-nullable or update failed: %', SQLERRM;
  END;
END $$;

-- Add foreign key constraints only if they don't exist
DO $$
BEGIN
  -- Add foreign key for questions.user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'questions_user_id_fkey' 
    AND table_name = 'questions'
  ) THEN
    ALTER TABLE public.questions
    ADD CONSTRAINT questions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key for answers.user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'answers_user_id_fkey' 
    AND table_name = 'answers'
  ) THEN
    ALTER TABLE public.answers  
    ADD CONSTRAINT answers_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key for answers.question_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'answers_question_id_fkey' 
    AND table_name = 'answers'
  ) THEN
    ALTER TABLE public.answers
    ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better performance on user-specific queries
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON public.questions(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON public.answers(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);

-- Create trigger to ensure only approved questions can have answers
CREATE OR REPLACE FUNCTION check_question_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT status FROM public.questions WHERE id = NEW.question_id) != 'approved' THEN
    RAISE EXCEPTION 'Cannot add answer to non-approved question';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS check_question_approved_before_answer ON public.answers;
CREATE TRIGGER check_question_approved_before_answer
  BEFORE INSERT ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION check_question_approved();