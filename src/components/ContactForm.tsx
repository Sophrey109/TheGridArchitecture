import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, Clock } from 'lucide-react';

interface ContactFormProps {
  title?: string;
  description?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  title = "Contact Us", 
  description = "Get in touch with our team. We'll respond within 24 hours." 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ resetTime?: string; blocked?: boolean }>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 5000) {
      newErrors.message = 'Message must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    if (rateLimitInfo.blocked) {
      const resetTime = rateLimitInfo.resetTime ? new Date(rateLimitInfo.resetTime) : null;
      const timeLeft = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000 / 60) : 0;
      
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait ${timeLeft} minutes before submitting again.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: formData
      });

      if (error) {
        console.error('Contact form error:', error);
        
        // Handle rate limiting
        if (error.message?.includes('Too many requests') || error.status === 429) {
          const resetTime = error.context?.resetTime;
          setRateLimitInfo({ 
            blocked: true, 
            resetTime: resetTime 
          });
          
          toast({
            title: "Too Many Requests",
            description: "You've reached the submission limit. Please try again later.",
            variant: "destructive",
          });
          return;
        }
        
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Message Sent!",
          description: data.message || "Thank you for your message. We'll get back to you soon!",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.message?.includes('suspicious content')) {
        errorMessage = 'Message contains content that cannot be processed. Please revise your message.';
      } else if (error.message?.includes('rate limit') || error.message?.includes('Too many')) {
        errorMessage = 'You\'ve submitted too many messages recently. Please wait before trying again.';
      } else if (error.message?.includes('validation') || error.message?.includes('required')) {
        errorMessage = 'Please check your input and try again.';
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBlocked = rateLimitInfo.blocked && rateLimitInfo.resetTime && new Date(rateLimitInfo.resetTime) > new Date();

  return (
    <Card className="w-full max-w-2xl card-modern">
      <CardHeader>
        <CardTitle className="article-title flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <p className="body-text text-muted-foreground">
          {description}
        </p>
        {isBlocked && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Clock className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              Rate limit active. Please wait before submitting again.
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-destructive' : ''}
                placeholder="Your full name"
                maxLength={100}
                disabled={isSubmitting || isBlocked}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="your.email@example.com"
                disabled={isSubmitting || isBlocked}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={errors.subject ? 'border-destructive' : ''}
              placeholder="Brief subject of your message"
              maxLength={200}
              disabled={isSubmitting || isBlocked}
            />
            {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`min-h-[120px] ${errors.message ? 'border-destructive' : ''}`}
              placeholder="Tell us how we can help you..."
              maxLength={5000}
              disabled={isSubmitting || isBlocked}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.message.length}/5000 characters
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-modern btn-gradient" 
            disabled={isSubmitting || isBlocked}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>🔒 Your information is secure and will only be used to respond to your inquiry.</p>
            <p>Rate limited: Maximum 3 submissions per 15 minutes for security.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};