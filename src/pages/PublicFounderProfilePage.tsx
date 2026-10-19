import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, TrendingUp, Building2, Link as LinkIcon, User } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { getPublicFounderProfile, PublicFounderProfile } from '../api/endpoints/publicProfile';

export default function PublicFounderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<PublicFounderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProfile(id);
    }
  }, [id]);

  const loadProfile = async (founderId: string) => {
    setIsLoading(true);
    try {
      const data = await getPublicFounderProfile(founderId);
      setProfile(data);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Profile not found' : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center text-gray-600">Loading profile...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !profile) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{error || 'Profile not found'}</h1>
            <Link to="/discover" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
              ← Back to Discover
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{profile.founderName}</h1>
            <div className="mt-2 flex items-center gap-2 text-lg text-gray-700">
              <Building2 className="h-5 w-5" />
              <span>{profile.startupName}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {profile.stage && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{profile.stage.name}</span>
              </div>
            )}
            {profile.sector && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                {profile.sector.name}
              </span>
            )}
            {profile.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6">
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 flex gap-4">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <LinkIcon className="h-4 w-4" />
                LinkedIn
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <User className="h-4 w-4" />
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/discover" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Discover
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
