-- Remove sensitive email data from public social_links table
DELETE FROM public.social_links WHERE url LIKE '%thegridarchitecture.uk@gmail.com%' OR url LIKE '%@gmail.com%';