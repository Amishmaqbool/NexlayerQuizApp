import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters first
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const errorCode = searchParams.get('error_code');

        if (error) {
          let message = 'Authentication failed';
          
          if (errorCode === 'otp_expired') {
            message = 'Email confirmation link has expired. Please sign up again to get a new confirmation link.';
          } else if (errorDescription) {
            message = decodeURIComponent(errorDescription.replace(/\+/g, ' '));
          }
          
          toast({
            title: 'Email Confirmation Failed',
            description: message,
            variant: 'destructive',
          });
          
          navigate('/', { replace: true });
          return;
        }

        // Handle successful email confirmation
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const tokenType = searchParams.get('token_type');

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }

          toast({
            title: 'Email Confirmed!',
            description: 'Your account has been successfully verified. Welcome!',
          });

          navigate('/', { replace: true });
        } else {
          // No auth tokens found, try to get session normally
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            toast({
              title: 'Welcome back!',
              description: 'You are already signed in.',
            });
          } else {
            toast({
              title: 'Session expired',
              description: 'Please sign in again.',
            });
          }

          navigate('/', { replace: true });
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        toast({
          title: 'Authentication Error',
          description: err.message || 'Something went wrong during authentication.',
          variant: 'destructive',
        });
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" style={{backgroundColor: '#191919'}}>
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-nexlayer-cyan mx-auto" />
        <h2 className="text-lg font-semibold text-foreground">Processing Email Confirmation</h2>
        <p className="text-muted-foreground">Please wait while we verify your email...</p>
      </div>
    </div>
  );
};
