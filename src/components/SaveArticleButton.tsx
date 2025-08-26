import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedArticles } from '@/hooks/useSavedArticles';

interface SaveArticleButtonProps {
  articleId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const SaveArticleButton: React.FC<SaveArticleButtonProps> = ({
  articleId,
  variant = 'outline',
  size = 'default',
  showText = false,
}) => {
  const { isArticleSaved, toggleSaveArticle, isSaving } = useSavedArticles();
  const saved = isArticleSaved(articleId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => toggleSaveArticle(articleId)}
      disabled={isSaving}
      className={saved ? 'text-primary' : ''}
    >
      {saved ? (
        <BookmarkCheck className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      ) : (
        <Bookmark className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (saved ? 'Saved' : 'Save')}
    </Button>
  );
};