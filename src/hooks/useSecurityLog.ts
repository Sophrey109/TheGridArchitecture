import { supabase } from '@/integrations/supabase/client';

export type SecurityEventType = 
  | 'login_attempt' 
  | 'login_success' 
  | 'login_failure' 
  | 'logout' 
  | 'failed_request' 
  | 'suspicious_activity';

interface SecurityLogData {
  event_type: SecurityEventType;
  user_id?: string;
  email?: string;
  details?: string;
}

export const useSecurityLog = () => {
  const logSecurityEvent = async (data: SecurityLogData) => {
    try {
      await supabase.functions.invoke('security-log', {
        body: data
      });
    } catch (error) {
      // Log security events should not fail silently in production
      // but also shouldn't disrupt user experience
      console.error('Failed to log security event:', error);
    }
  };

  return { logSecurityEvent };
};