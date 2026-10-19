import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      console.log('Attempting to verify with token:', token);

      try {
        await authApi.verifyEmail(token);
        console.log('Verification successful!');
        setStatus('success');
        toast.success('Email verified successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error: any) {
        console.error('Verification failed:', error);
        console.error('Error response:', error.response?.data);
        setStatus('error');
        setErrorMessage(
          error.response?.data?.detail || 'Verification failed. The token may be invalid or expired.'
        );
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h1 className="text-2xl font-bold font-serif text-ink mb-2">
                Verifying Your Email
              </h1>
              <p className="text-muted-text">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold font-serif text-ink mb-2">
                Email Verified!
              </h1>
              <p className="text-muted-text mb-4">
                Your email has been successfully verified.
              </p>
              <p className="text-sm text-muted-text">
                Redirecting to login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <XCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h1 className="text-2xl font-bold font-serif text-ink mb-2">
                Verification Failed
              </h1>
              <p className="text-muted-text mb-6">{errorMessage}</p>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/verify-email')}
                  variant="primary"
                  fullWidth
                >
                  Request New Verification Email
                </Button>
                
                <Link to="/login">
                  <Button variant="secondary" fullWidth>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
