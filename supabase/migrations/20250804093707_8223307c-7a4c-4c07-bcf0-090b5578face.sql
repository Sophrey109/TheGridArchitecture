-- Fix the article ID by removing the trailing newline character
UPDATE "Articles" 
SET id = 'architect-peter-womersley' 
WHERE id = 'architect-peter-womersley
';