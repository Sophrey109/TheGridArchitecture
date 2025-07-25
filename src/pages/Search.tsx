import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, MapPin, Building } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useArticles } from '@/hooks/useArticles';
import { formatDate } from 'date-fns';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: articles = [], isLoading: articlesLoading } = useArticles();

  const isLoading = jobsLoading || articlesLoading;

  // Filter articles based on search query
  const filteredArticles = articles.filter(article => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      article.Title?.toLowerCase().includes(query) ||
      article.Content?.toLowerCase().includes(query) ||
      article.Author?.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(job => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      job['Job Title']?.toLowerCase().includes(query) ||
      job.Company?.toLowerCase().includes(query) ||
      job.Location?.toLowerCase().includes(query) ||
      job.Description?.toLowerCase().includes(query) ||
      job.Type?.toLowerCase().includes(query)
    );
  });

  const totalResults = filteredArticles.length + filteredJobs.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Search</h1>
            <p className="text-muted-foreground mb-6">
              Find articles, jobs, and more across The Grid
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles, jobs, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {isLoading ? 'Searching...' : `${totalResults} results for "${searchQuery}"`}
              </h2>
            </div>
          )}

          {!isLoading && searchQuery && (
            <div className="space-y-8">
              {/* Articles Results */}
              {filteredArticles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>Articles</span>
                    <Badge variant="secondary">{filteredArticles.length}</Badge>
                  </h3>
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {article.image_url && (
                              <img
                                src={article.image_url}
                                alt={article.Title}
                                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <Link
                                to={`/articles/${article.id}`}
                                className="text-lg font-semibold hover:text-primary transition-colors"
                              >
                                {article.Title}
                              </Link>
                              {article.excerpt && (
                                <p className="text-muted-foreground mt-1 line-clamp-2">
                                  {article.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                {article.Author && <span>By {article.Author}</span>}
                                {article['Published Date'] && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(new Date(article['Published Date']), 'MMM d, yyyy')}</span>
                                  </div>
                                )}
                              </div>
                              {article.tags && article.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {article.tags.slice(0, 3).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs Results */}
              {filteredJobs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>Jobs</span>
                    <Badge variant="secondary">{filteredJobs.length}</Badge>
                  </h3>
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <Link
                                to={`/jobs/${job.id}`}
                                className="text-lg font-semibold hover:text-primary transition-colors"
                              >
                                {job['Job Title']}
                              </Link>
                              {job.Company && (
                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                  <Building className="h-4 w-4" />
                                  <span>{job.Company}</span>
                                </div>
                              )}
                              {job.Location && (
                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.Location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                {job.Type && (
                                  <Badge variant="outline">{job.Type}</Badge>
                                )}
                                {job['Date Posted'] && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(new Date(job['Date Posted']), 'MMM d, yyyy')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {job.Salary && (
                              <div className="text-right">
                                <div className="text-lg font-semibold text-primary">
                                  {job.Salary}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && searchQuery && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No results found for "{searchQuery}". Try different keywords or check the spelling.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!searchQuery && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Enter a search term to find articles, jobs, and more
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;