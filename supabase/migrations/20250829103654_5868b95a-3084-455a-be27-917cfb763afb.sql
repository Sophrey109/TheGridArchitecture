-- Remove sensitive email data from public social_links table
DELETE FROM public.social_links WHERE url LIKE '%thegridarchitecture.uk@gmail.com%' OR url LIKE '%@gmail.com%';

-- Create a secure contact_info table that's only accessible by admins
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_type text NOT NULL,
  contact_value text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for contact_info table
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Only admins can access contact information
CREATE POLICY "Only admins can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert the business email into the secure table
INSERT INTO public.contact_info (contact_type, contact_value) 
VALUES ('business_email', 'thegridarchitecture.uk@gmail.com');

-- Create a trigger for contact_info updated_at
CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();