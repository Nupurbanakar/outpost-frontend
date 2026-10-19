import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [apiError, setApiError] = useState<any>(null);

  const validateForm = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      // Always show success message (don't reveal if email exists)
      setIsSubmitted(true);
      console.error('Forgot password request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper p-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold font-serif text-ink mb-2">Check Your Email</h1>
            <p className="text-muted-text">
              If an account exists with <strong>{email}</strong>, we've sent password reset instructions.
            </p>
          </div>

          {/* Card */}
          <div className="bg-paper-light border border-line p-8 shadow-auth text-center space-y-6">
            <p className="text-sm text-muted-text">
              Didn't receive the email? Check your spam folder or try again with a different email address.
            </p>

            <div className="pt-4">
              <Link to="/login">
                <Button variant="secondary" fullWidth>
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
            <div className="w-4 h-4 rounded-full border-2 border-gold"></div>
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">Forgot Password?</h1>
          <p className="text-muted-text">Enter your email to receive reset instructions</p>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error */}
            {apiError && <ApiErrorDisplay error={apiError} />}

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={!!errors.email}
                placeholder="founder@startup.com"
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                to="/login"
                className="text-sm text-muted-text hover:text-ink inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
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
