import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { isErrorCode } from '@/utils/errorHandling';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters';
    }

    // Confirm password validation
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signup({ email, password });
      toast.success('Account created successfully!');
      // After signup, user needs to complete onboarding
      navigate('/onboarding');
    } catch (error) {
      // Handle EMAIL_TAKEN specifically
      if (isErrorCode(error, 'EMAIL_TAKEN')) {
        setErrors({ email: 'This email is already registered' });
      } else {
        setApiError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ink mb-4">
            <div className="w-4 h-4 rounded-full border-2 border-gold"></div>
          </div>
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">Create Account</h1>
          <p className="text-muted-text">Join the T-Hub founder community</p>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error */}
            {apiError && <ApiErrorDisplay error={apiError} />}

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
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
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
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
                placeholder="Min. 10 characters"
                disabled={isLoading}
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
                placeholder="Re-enter password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-text">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-text">
          Exclusive to the T-Hub founder community
        </p>
      </div>
    </div>
  );
}
