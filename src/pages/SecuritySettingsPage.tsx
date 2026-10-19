import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { ManageIdentities } from '@/components/profile/ManageIdentities';
import { foundersApi } from '@/api/endpoints/founders';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function SecuritySettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasEmailAuth, setHasEmailAuth] = useState(false);

  useEffect(() => {
    const loadIdentities = async () => {
      try {
        const data = await foundersApi.getIdentities();
        setHasEmailAuth(data.some((identity) => identity.provider === 'EMAIL'));
      } catch (err) {
        console.error('Failed to load identities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIdentities();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">Security Settings</h1>
          <p className="text-muted-text">
            Manage your password and sign-in methods
          </p>
        </div>

        <div className="space-y-6">
          {/* Sign-in Methods */}
          <ManageIdentities />

          {/* Change Password - Only show for email users */}
          {hasEmailAuth && <ChangePasswordForm />}
        </div>
      </div>
    </AppLayout>
  );
}
