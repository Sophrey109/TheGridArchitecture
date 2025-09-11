-- Add explicit DELETE policy for contact_messages table for comprehensive protection
CREATE POLICY "Only admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add additional security constraint to ensure only specific status values are allowed
-- (This was added in the previous migration but let's ensure it exists)
DO $$
BEGIN
  -- Check if constraint already exists before adding
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_contact_message_status' 
    AND table_name = 'contact_messages'
  ) THEN
    ALTER TABLE public.contact_messages 
    ADD CONSTRAINT check_contact_message_status 
    CHECK (status IN ('unread', 'read', 'replied', 'spam', 'archived'));
  END IF;
END $$;