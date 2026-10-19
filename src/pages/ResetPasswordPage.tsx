import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [apiError, setApiError] = useState<any>(null);
  const [tokenStatus, setTokenStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
    } else {
      setTokenStatus('valid');
    }
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm() || !token) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setApiError(error);
      
      // Check if token is invalid/expired
      if ((error as any)?.response?.status === 400) {
        setTokenStatus('invalid');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Checking token state
  if (tokenStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Invalid token state
  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
              <XCircle className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-muted-text mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button variant="primary" fullWidth>
                  Request New Reset Link
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="secondary" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink mb-4">
            <Lock className="w-6 h-6 text-paper-light" />
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">Reset Password</h1>
          <p className="text-muted-text">Enter your new password below</p>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error */}
            {apiError && <ApiErrorDisplay error={apiError} />}

            {/* Password Requirements */}
            <div className="bg-primary-50 border border-primary-200 rounded p-3 text-sm text-muted-text">
              <p className="font-medium text-ink mb-1">Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 10 characters</li>
              </ul>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="password" className="label">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={!!errors.password}
                placeholder="Enter new password"
                disabled={isSubmitting}
                autoComplete="new-password"
                autoFocus
              />
              {errors.password && (
                <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={!!errors.confirmPassword}
                placeholder="Confirm new password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                to="/login"
                className="text-sm text-muted-text hover:text-ink"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-text mt-8">
          Exclusive to the T-Hub founder community
        </p>
      </div>
    </div>
  );
}
