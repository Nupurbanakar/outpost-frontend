import { useState, useEffect } from 'react';
import { foundersApi, Identity } from '@/api/endpoints/founders';
import { parseApiError } from '@/utils/errorHandling';
import { formatDate } from '@/utils/dateUtils';
import { Mail, Shield, Trash2 } from 'lucide-react';

export function ManageIdentities() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [providerToUnlink, setProviderToUnlink] = useState<'EMAIL' | 'GOOGLE' | null>(null);

  const loadIdentities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await foundersApi.getIdentities();
      setIdentities(data);
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIdentities();
  }, []);

  const handleUnlinkClick = (provider: 'EMAIL' | 'GOOGLE') => {
    setProviderToUnlink(provider);
    setShowConfirmModal(true);
  };

  const handleConfirmUnlink = async () => {
    if (!providerToUnlink) return;

    setUnlinkingProvider(providerToUnlink);
    setError(null);
    
    try {
      await foundersApi.unlinkIdentity(providerToUnlink);
      await loadIdentities();
      setShowConfirmModal(false);
      setProviderToUnlink(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Cannot unlink your last sign-in method. Please add another method first.');
      } else {
        setError(parseApiError(err));
      }
    } finally {
      setUnlinkingProvider(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'EMAIL':
        return <Mail className="w-5 h-5" />;
      case 'GOOGLE':
        return <Shield className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'EMAIL':
        return 'Email & Password';
      case 'GOOGLE':
        return 'Google';
      default:
        return provider;
    }
  };

  const canUnlink = identities.length > 1;

  if (isLoading) {
    return (
      <div className="bg-paper-light border border-line p-6">
        <h3 className="text-xl font-serif font-bold text-ink mb-2">Sign-in Methods</h3>
        <p className="text-sm text-muted-text">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-paper-light border border-line p-6">
        <h3 className="text-xl font-serif font-bold text-ink mb-2">Sign-in Methods</h3>
        <p className="text-sm text-muted-text mb-6">
          Manage how you sign in to your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {identities.map((identity) => (
            <div
              key={identity.provider}
              className="flex items-center justify-between p-4 border border-line"
            >
              <div className="flex items-center gap-3">
                <div className="text-ink">
                  {getProviderIcon(identity.provider)}
                </div>
                <div>
                  <p className="font-medium text-ink">
                    {getProviderLabel(identity.provider)}
                  </p>
                  <p className="text-xs text-muted-text">
                    Linked on {formatDate(identity.linkedAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleUnlinkClick(identity.provider)}
                disabled={!canUnlink || unlinkingProvider === identity.provider}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={!canUnlink ? 'Cannot unlink your last sign-in method' : 'Unlink this method'}
              >
                <Trash2 className="w-4 h-4" />
                {unlinkingProvider === identity.provider ? 'Unlinking...' : 'Unlink'}
              </button>
            </div>
          ))}
        </div>

        {!canUnlink && (
          <p className="mt-4 text-xs text-muted-text italic">
            You must have at least one sign-in method linked to your account.
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && providerToUnlink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-paper-light max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-serif font-bold text-ink mb-3">
              Unlink {getProviderLabel(providerToUnlink)}?
            </h3>
            <p className="text-muted-text mb-6">
              Are you sure you want to unlink this sign-in method? You will no longer be able to
              sign in using {getProviderLabel(providerToUnlink).toLowerCase()}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setProviderToUnlink(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-line text-ink font-semibold hover:bg-[#f5f3ed] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnlink}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Unlink
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
