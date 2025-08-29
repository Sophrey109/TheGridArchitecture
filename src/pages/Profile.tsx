import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, MessageCircle, Bookmark, Briefcase, Calendar, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useUserComments } from '@/hooks/useUserComments';
import { useArticles } from '@/hooks/useArticles';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { savedArticles } = useSavedArticles();
  const { savedJobs } = useSavedJobs();
  const { comments } = useUserComments();
  const { data: allArticles } = useArticles();
  const { data: allJobs } = useJobs();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Filter saved content
  const savedArticlesList = allArticles?.filter(article => 
    savedArticles.includes(article.id)
  ) || [];

  const savedJobsList = allJobs?.filter(job => 
    savedJobs.includes(job.id)
  ) || [];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let avatarUrl = profile?.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('article-images')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      const { error } = await updateProfile({
        full_name: fullName,
        username: username,
        avatar_url: avatarUrl,
      });

      if (error) throw error;

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Please sign in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your account settings and view your saved content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || profile?.avatar_url || ''} />
                    <AvatarFallback className="text-lg">
                      {fullName ? fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Camera className="h-6 w-6 text-white" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold">{profile?.full_name || 'No name set'}</h2>
                      <p className="text-muted-foreground">@{profile?.username || 'No username set'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => {
                          setIsEditing(false);
                          setFullName(profile?.full_name || '');
                          setUsername(profile?.username || '');
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles" className="flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved Articles ({savedArticlesList.length})</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Saved Jobs ({savedJobsList.length})</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Comments ({comments.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              {savedArticlesList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No saved articles yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/articles">Browse Articles</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {savedArticlesList.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <Link to={`/articles/${article.id}`} className="hover:text-primary">
                              <h3 className="font-semibold text-lg mb-2">{article.Title}</h3>
                            </Link>
                            {article.excerpt && (
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{article['Published Date'] ? new Date(article['Published Date']).toLocaleDateString() : 'No date'}</span>
                              </span>
                              {article.Author && <span>By {article.Author}</span>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/articles/${article.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {savedJobsList.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No saved jobs yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {savedJobsList.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{job['Job Title']}</h3>
                            <div className="space-y-2">
                              {job.Company && <p className="text-muted-foreground">{job.Company}</p>}
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                {job.Location && <span>{job.Location}</span>}
                                {job.Salary && <span>{job.Salary}</span>}
                                {job['Date Posted'] && (
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(job['Date Posted']).toLocaleDateString()}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/jobs/${job.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {comments.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No comments yet</p>
                    <Button asChild className="mt-4">
                      <Link to="/articles">Start Reading & Commenting</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant={comment.is_approved ? "default" : "secondary"}>
                                {comment.is_approved ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Review
                                  </>
                                )}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/articles/${comment.article_id}#comment-${comment.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <Separator />
                          <p className="text-xs text-muted-foreground">
                            Comment on article ID: {comment.article_id}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;