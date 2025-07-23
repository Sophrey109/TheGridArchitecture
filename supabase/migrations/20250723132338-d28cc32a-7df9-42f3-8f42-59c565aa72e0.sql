-- Add article_type column to Articles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'Articles'
        AND column_name = 'article_type'
    ) THEN
        ALTER TABLE public."Articles" ADD COLUMN article_type TEXT;
        COMMENT ON COLUMN public."Articles".article_type IS 'Custom article type/category for each article';
    END IF;
END $$;