import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityLogRequest {
  event_type: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'failed_request' | 'suspicious_activity';
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { event_type, user_id, email, ip_address, user_agent, details }: SecurityLogRequest = await req.json();

    // Validate required fields
    if (!event_type) {
      return new Response(JSON.stringify({ error: 'Missing event_type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get IP and User Agent from headers if not provided
    const clientIp = ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const clientUserAgent = user_agent || req.headers.get('user-agent') || 'unknown';

    // Store security log
    const { error } = await supabase
      .from('security_logs')
      .insert({
        event_type,
        user_id: user_id || null,
        email: email || null,
        ip_address: clientIp,
        user_agent: clientUserAgent,
        details: details || null,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing security log:', error);
      return new Response(JSON.stringify({ error: 'Failed to store security log' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Security event logged:', { event_type, user_id, email: email?.substring(0, 3) + '***' });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in security-log function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);