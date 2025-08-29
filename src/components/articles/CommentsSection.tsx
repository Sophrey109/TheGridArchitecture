import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Edit, Trash2, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  parent_comment_id: string | null;
  replies?: Comment[];
  profile?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentsSectionProps {
  articleId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch comments and profiles separately
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for all comment authors
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(comment => comment.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds);

        // Map profiles to comments and organize into threads
        const commentsWithProfiles = data.map(comment => ({
          ...comment,
          profile: profiles?.find(p => p.id === comment.user_id) || null
        })) as Comment[];

        // Organize comments into threads (parent comments with their replies)
        const parentComments = commentsWithProfiles.filter(comment => !comment.parent_comment_id);
        const childComments = commentsWithProfiles.filter(comment => comment.parent_comment_id);

        // Attach replies to their parent comments  
        return parentComments.map(parent => ({
          ...parent,
          replies: childComments
            .filter(child => child.parent_comment_id === parent.id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        }));
      }

      return [];
    },
  });

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: content.trim(),
          parent_comment_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setNewComment('');
      setReplyContent('');
      setReplyingTo(null);
      toast({
        title: "Comment added",
        description: "Your comment has been submitted and is pending approval.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ content: content.trim() })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      setEditingComment(null);
      setEditContent('');
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add a comment.",
        variant: "destructive",
      });
      return;
    }
    addCommentMutation.mutate({ content: newComment });
  };

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply.",
        variant: "destructive",
      });
      return;
    }
    addCommentMutation.mutate({ content: replyContent, parentId });
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = () => {
    if (!editContent.trim() || !editingComment) return;
    updateCommentMutation.mutate({
      commentId: editingComment,
      content: editContent,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const approvedComments = comments?.filter(comment => 
    comment.is_approved || (user && comment.user_id === user.id)
  ).map(comment => ({
    ...comment,
    replies: comment.replies?.filter(reply => 
      reply.is_approved || (user && reply.user_id === user.id)
    ) || []
  })) || [];

  const totalCommentsCount = approvedComments.reduce((count, comment) => 
    count + 1 + (comment.replies?.length || 0), 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({totalCommentsCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new comment */}
        <div className="space-y-4">
          <Textarea
            placeholder={user ? "Share your thoughts about this article..." : "Please sign in to leave a comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user || addCommentMutation.isPending}
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim() || !user || addCommentMutation.isPending}
            className="w-full sm:w-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            {addCommentMutation.isPending ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : approvedComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            approvedComments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Main Comment */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profile?.avatar_url || ''} />
                        <AvatarFallback>
                          {comment.profile?.full_name 
                            ? comment.profile.full_name.charAt(0).toUpperCase()
                            : comment.user_id.substring(0, 2).toUpperCase()
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {comment.profile?.full_name || comment.profile?.username || 'Anonymous User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                          {comment.updated_at !== comment.created_at && ' (edited)'}
                          {!comment.is_approved && user && comment.user_id === user.id && (
                            <span className="ml-2 text-yellow-600">(Pending approval)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {user && comment.user_id === user.id && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditComment(comment)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={handleUpdateComment}
                          disabled={updateCommentMutation.isPending}
                        >
                          {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(comment.id)}
                          className="text-xs"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="space-y-2 border-t pt-3">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyContent.trim() || addCommentMutation.isPending}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          {addCommentMutation.isPending ? 'Replying...' : 'Reply'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border rounded-lg p-3 bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.profile?.avatar_url || ''} />
                              <AvatarFallback className="text-xs">
                                {reply.profile?.full_name 
                                  ? reply.profile.full_name.charAt(0).toUpperCase()
                                  : reply.user_id.substring(0, 2).toUpperCase()
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-medium">
                                {reply.profile?.full_name || reply.profile?.username || 'Anonymous User'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(reply.created_at)}
                                {reply.updated_at !== reply.created_at && ' (edited)'}
                                {!reply.is_approved && user && reply.user_id === user.id && (
                                  <span className="ml-2 text-yellow-600">(Pending approval)</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {user && reply.user_id === user.id && (
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditComment(reply)}
                              >
                                <Edit className="h-2 w-2" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(reply.id)}
                              >
                                <Trash2 className="h-2 w-2" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {editingComment === reply.id ? (
                          <div className="space-y-2 mt-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={handleUpdateComment}
                                disabled={updateCommentMutation.isPending}
                              >
                                {updateCommentMutation.isPending ? 'Saving...' : 'Save'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs leading-relaxed whitespace-pre-wrap mt-2">
                            {reply.content}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};