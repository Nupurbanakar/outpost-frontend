import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { foundersApi } from '@/api/endpoints/founders';
import { parseApiError } from '@/utils/errorHandling';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(10, 'Password must be at least 10 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await foundersApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      setSuccess(true);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      const errorMessage = parseApiError(err);
      
      // Check if it's a wrong password error (401 or specific error message)
      if (err.response?.status === 401 || errorMessage.includes('current password')) {
        setError('Current password is incorrect');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-paper-light border border-line p-6">
      <h3 className="text-xl font-serif font-bold text-ink mb-2">Change Password</h3>
      <p className="text-sm text-muted-text mb-6">
        Update your password to keep your account secure
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-ink mb-2">
            Current Password
          </label>
          <input
            {...register('currentPassword')}
            type="password"
            id="currentPassword"
            className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
            autoComplete="current-password"
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-ink mb-2">
            New Password
          </label>
          <input
            {...register('newPassword')}
            type="password"
            id="newPassword"
            className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
          <p className="text-xs text-muted-text mt-1">At least 10 characters</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-2">
            Confirm New Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm">
            Password changed successfully!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
