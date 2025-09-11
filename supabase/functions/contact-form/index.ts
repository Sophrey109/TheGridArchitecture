import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// In-memory rate limiting store (resets on function restart)
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 submissions per 15 minutes per IP
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /script/i,
  /javascript/i,
  /<[^>]*>/,
  /\b(viagra|cialis|casino|poker|lottery|winner|congratulations|inheritance|prince|nigeria)\b/i,
];

const validateInput = (data: ContactFormData): string | null => {
  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    return 'Name is required';
  }
  if (data.name.length > MAX_NAME_LENGTH) {
    return `Name must be less than ${MAX_NAME_LENGTH} characters`;
  }

  // Email validation
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    return 'Valid email address is required';
  }

  // Subject validation
  if (data.subject && data.subject.length > MAX_SUBJECT_LENGTH) {
    return `Subject must be less than ${MAX_SUBJECT_LENGTH} characters`;
  }

  // Message validation
  if (!data.message || data.message.trim().length < MIN_MESSAGE_LENGTH) {
    return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  }
  if (data.message.length > MAX_MESSAGE_LENGTH) {
    return `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
  }

  // Check for suspicious patterns
  const fullText = `${data.name} ${data.email} ${data.subject || ''} ${data.message}`;
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullText)) {
      return 'Message contains suspicious content';
    }
  }

  return null;
};

const checkRateLimit = (clientIP: string): { allowed: boolean; resetTime?: number } => {
  const now = Date.now();
  const key = clientIP;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  const record = rateLimitStore.get(key)!;
  
  // Reset if window has passed
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetTime = record.firstRequest + RATE_LIMIT_WINDOW;
    return { allowed: false, resetTime };
  }

  // Increment counter
  record.count += 1;
  rateLimitStore.set(key, record);
  return { allowed: true };
};

const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, str === 'message' ? MAX_MESSAGE_LENGTH : MAX_NAME_LENGTH);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    // Get client info
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(`Contact form request from IP: ${clientIP}`);

    // Rate limiting check
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime!);
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      
      return new Response(JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        resetTime: resetTime.toISOString()
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString(),
          ...corsHeaders 
        },
      });
    }

    const rawData: ContactFormData = await req.json();

    // Input validation
    const validationError = validateInput(rawData);
    if (validationError) {
      console.log(`Validation failed for IP ${clientIP}: ${validationError}`);
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(rawData.name),
      email: rawData.email.trim().toLowerCase(),
      subject: rawData.subject ? sanitizeString(rawData.subject) : null,
      message: sanitizeString(rawData.message),
    };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check for duplicate recent submissions from same IP/email
    const { data: recentSubmissions } = await supabase
      .from('contact_messages')
      .select('id, created_at')
      .or(`ip_address.eq.${clientIP},email.eq.${sanitizedData.email}`)
      .gte('created_at', new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString())
      .limit(5);

    if (recentSubmissions && recentSubmissions.length >= MAX_REQUESTS_PER_WINDOW) {
      console.log(`Duplicate submission attempt from IP: ${clientIP} / Email: ${sanitizedData.email}`);
      return new Response(JSON.stringify({ 
        error: 'Too many recent submissions. Please wait before submitting again.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Insert contact message
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        ip_address: clientIP,
        user_agent: userAgent,
        status: 'unread',
        submitted_at: new Date().toISOString(),
      })
      .select('id');

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to submit message. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Contact form submitted successfully: ${data?.[0]?.id} from IP: ${clientIP}`);

    // Log security event
    await supabase.functions.invoke('security-log', {
      body: {
        event_type: 'contact_form_submission',
        ip_address: clientIP,
        user_agent: userAgent,
        details: `Contact form submission from ${sanitizedData.email}`,
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!',
      id: data?.[0]?.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to client
    return new Response(JSON.stringify({ 
      error: 'An error occurred while processing your request. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);