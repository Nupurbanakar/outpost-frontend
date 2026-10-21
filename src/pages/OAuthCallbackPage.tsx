import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Extract tokens from URL
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const error = searchParams.get('error');

      // Handle error case
      if (error) {
        console.error('OAuth error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
        return;
      }

      // Validate tokens exist
      if (!accessToken || !refreshToken) {
        console.error('Missing tokens in OAuth callback');
        toast.error('Authentication failed. Missing tokens.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Fetch user profile to store in context
        const response = await fetch('http://localhost:8080/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('OAuth login successful:', userData);
        toast.success('Logged in successfully!');

        // Redirect based on onboarding status
        if (!userData.onboarded) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/discover', { replace: true });
        }
      } catch (error) {
        console.error('Error during OAuth callback:', error);
        toast.error('Failed to complete authentication');
        
        // Clear invalid tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        navigate('/login', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-text">Completing authentication...</p>
      </div>
    </div>
  );
}
