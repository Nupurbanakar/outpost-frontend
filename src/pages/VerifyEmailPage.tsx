import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address not found');
      return;
    }

    setIsResending(true);

    try {
      await authApi.resendVerification(email);
      toast.success('Verification email sent!');
      setCooldown(60); // 1 minute cooldown
    } catch (error) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">Check Your Email</h1>
          <p className="text-muted-text">We've sent a verification link to:</p>
          {email && (
            <p className="text-ink font-medium mt-2">{email}</p>
          )}
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth text-center space-y-6">
          <p className="text-sm text-muted-text">
            Click the link in the email to verify your account. If you don't see the email,
            check your spam folder.
          </p>

          {/* Resend Button */}
          <div>
            <Button
              onClick={handleResend}
              variant="secondary"
              fullWidth
              disabled={isResending || cooldown > 0}
            >
              {isResending
                ? 'Sending...'
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Verification Email'}
            </Button>
          </div>

          {/* Back to Login */}
          <p className="text-sm text-muted-text">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to login
            </Link>
          </p>

          {/* Change Email */}
          <p className="text-sm text-muted-text">
            Wrong email?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
