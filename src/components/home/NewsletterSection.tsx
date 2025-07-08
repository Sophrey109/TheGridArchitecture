
import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the newsletter subscription
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-400" />
          </div>
          <h2 className="hero-text mb-4">Thank you for subscribing!</h2>
          <p className="body-text text-primary-foreground/80">
            You'll receive our weekly digest of the best in architecture and design.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-primary-foreground text-primary border-0">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <h2 className="hero-text mb-4">Stay Ahead of Design Trends</h2>
            <p className="body-text text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get our weekly newsletter featuring the latest in architecture, design innovations, 
              BIM technology, and exclusive insights from industry leaders. Join 25,000+ professionals.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12"
                />
                <Button type="submit" size="lg" className="px-8">
                  Subscribe
                </Button>
              </div>
              <p className="caption-text text-muted-foreground mt-3">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>

            <div className="flex justify-center space-x-8 mt-8 text-sm text-muted-foreground">
              <div className="text-center">
                <div className="font-semibold text-primary text-lg">25K+</div>
                <div>Subscribers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary text-lg">Weekly</div>
                <div>Delivery</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-primary text-lg">5 min</div>
                <div>Read Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
