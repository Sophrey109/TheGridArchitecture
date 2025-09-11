-- Add validation trigger for contact_messages to prevent spam and validate data
CREATE OR REPLACE FUNCTION public.validate_contact_message()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate name length and content
  IF LENGTH(TRIM(NEW.name)) < 1 OR LENGTH(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 1 and 100 characters';
  END IF;
  
  -- Validate email format
  IF NEW.email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate message length
  IF LENGTH(TRIM(NEW.message)) < 10 OR LENGTH(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message must be between 10 and 5000 characters';
  END IF;
  
  -- Validate subject length if provided
  IF NEW.subject IS NOT NULL AND LENGTH(NEW.subject) > 200 THEN
    RAISE EXCEPTION 'Subject must be less than 200 characters';
  END IF;
  
  -- Check for suspicious patterns
  IF NEW.name ~* '\b(viagra|cialis|casino|poker|lottery|winner|congratulations|inheritance|prince|nigeria)\b' OR
     NEW.message ~* '\b(viagra|cialis|casino|poker|lottery|winner|congratulations|inheritance|prince|nigeria)\b' OR
     NEW.subject ~* '\b(viagra|cialis|casino|poker|lottery|winner|congratulations|inheritance|prince|nigeria)\b' THEN
    RAISE EXCEPTION 'Message contains prohibited content';
  END IF;
  
  -- Check for HTML/script injection attempts
  IF NEW.name ~ '<[^>]*>' OR NEW.message ~ '<[^>]*>' OR 
     (NEW.subject IS NOT NULL AND NEW.subject ~ '<[^>]*>') THEN
    RAISE EXCEPTION 'HTML content is not allowed';
  END IF;
  
  -- Rate limiting check - prevent more than 3 submissions from same IP in 15 minutes
  IF EXISTS (
    SELECT 1 
    FROM public.contact_messages 
    WHERE ip_address = NEW.ip_address 
      AND created_at > NOW() - INTERVAL '15 minutes'
    HAVING COUNT(*) >= 3
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many submissions from this IP address';
  END IF;
  
  -- Rate limiting check - prevent more than 3 submissions from same email in 15 minutes
  IF EXISTS (
    SELECT 1 
    FROM public.contact_messages 
    WHERE LOWER(email) = LOWER(NEW.email)
      AND created_at > NOW() - INTERVAL '15 minutes'
    HAVING COUNT(*) >= 3
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many submissions from this email address';
  END IF;
  
  -- Sanitize and normalize data
  NEW.name = TRIM(NEW.name);
  NEW.email = LOWER(TRIM(NEW.email));
  NEW.message = TRIM(NEW.message);
  
  if NEW.subject IS NOT NULL THEN
    NEW.subject = TRIM(NEW.subject);
  END IF;
  
  -- Set default status if not provided
  IF NEW.status IS NULL THEN
    NEW.status = 'unread';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate contact messages before insert
CREATE TRIGGER validate_contact_message_trigger
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_contact_message();

-- Add index for better performance on rate limiting queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created 
ON public.contact_messages(ip_address, created_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email_created 
ON public.contact_messages(email, created_at);

-- Add check constraint for status values
ALTER TABLE public.contact_messages 
ADD CONSTRAINT check_contact_message_status 
CHECK (status IN ('unread', 'read', 'replied', 'spam', 'archived'));