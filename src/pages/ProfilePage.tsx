import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/contexts';
import { foundersApi, UpdateProfileRequest } from '@/api/endpoints/founders';
import { useStages } from '@/hooks/useStages';
import { useSectors } from '@/hooks/useSectors';
import { useInvalidateAIRankings } from '@/hooks';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PitchDeckUpload } from '@/components/profile/PitchDeckUpload';
import { parseApiError } from '@/utils/errorHandling';
import { getAIPreference } from '@/utils/aiPreferences';
import toast from 'react-hot-toast';
import { MapPin, Mail, Edit, Save, X, Globe, Link as LinkIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { stages, isLoading: stagesLoading } = useStages();
  const { sectors, isLoading: sectorsLoading } = useSectors();
  const invalidateAIRankings = useInvalidateAIRankings();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pitchDeckUrl, setPitchDeckUrl] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    founderName: user?.founderName || '',
    startupName: user?.startupName || '',
    city: user?.city || '',
    stageId: user?.stageId || user?.stage?.id || '',
    sectorId: user?.sectorId || user?.sector?.id || '',
    bio: user?.profile?.bio || user?.bio || '',
    website: user?.profile?.links?.find(l => l.type === 'OTHER')?.url || user?.website || '',
    linkedInUrl: user?.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user?.linkedInUrl || '',
    twitterUrl: user?.profile?.links?.find(l => l.type === 'X')?.url || user?.twitterUrl || '',
  });

  useEffect(() => {
    if (user) {
      console.log('ProfilePage - User data:', user);
      console.log('Stage:', user.stage, 'stageId:', user.stageId, 'stageName:', user.stageName);
      console.log('Sector:', user.sector, 'sectorId:', user.sectorId, 'sectorName:', user.sectorName);
      
      setFormData({
        founderName: user.founderName,
        startupName: user.startupName,
        city: user.city,
        stageId: user.stageId || user.stage?.id || '',
        sectorId: user.sectorId || user.sector?.id || '',
        bio: user.profile?.bio || user.bio || '',
        website: user.profile?.links?.find(l => l.type === 'OTHER')?.url || user.website || '',
        linkedInUrl: user.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user.linkedInUrl || '',
        twitterUrl: user.profile?.links?.find(l => l.type === 'X')?.url || user.twitterUrl || '',
      });
      
      // Load pitch deck
      loadPitchDeck();
    }
  }, [user]);

  const loadPitchDeck = async () => {
    try {
      // First check localStorage for cached URL
      const cachedUrl = localStorage.getItem('pitchDeckUrl');
      if (cachedUrl) {
        setPitchDeckUrl(cachedUrl);
        return;
      }

      // Try to check if pitch deck exists via backend
      // This endpoint may not exist, so we gracefully handle errors
      const url = await foundersApi.hasPitchDeck();
      if (url) {
        setPitchDeckUrl(url);
        localStorage.setItem('pitchDeckUrl', url);
      } else {
        setPitchDeckUrl(null);
        localStorage.removeItem('pitchDeckUrl');
      }
    } catch (err: any) {
      // No pitch deck uploaded yet or endpoint doesn't exist
      // Keep cached URL if it exists, otherwise clear
      const cachedUrl = localStorage.getItem('pitchDeckUrl');
      setPitchDeckUrl(cachedUrl);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    // Reset form to current user data
    if (user) {
      setFormData({
        founderName: user.founderName,
        startupName: user.startupName,
        city: user.city,
        stageId: user.stage?.id || '',
        sectorId: user.sector?.id || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedInUrl: user.linkedInUrl || '',
        twitterUrl: user.twitterUrl || '',
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Construct links array from individual URL fields
      const links = [];
      
      // LinkedIn URL - ensure it's a valid full URL
      if (formData.linkedInUrl && formData.linkedInUrl.trim()) {
        const linkedInUrl = formData.linkedInUrl.trim().startsWith('http') 
          ? formData.linkedInUrl.trim()
          : `https://linkedin.com/in/${formData.linkedInUrl.trim()}`;
        links.push({ type: 'LINKEDIN' as const, url: linkedInUrl });
      }
      
      // Twitter/X URL - ensure it's a valid full URL
      if (formData.twitterUrl && formData.twitterUrl.trim()) {
        const twitterUrl = formData.twitterUrl.trim().startsWith('http') 
          ? formData.twitterUrl.trim()
          : `https://twitter.com/${formData.twitterUrl.trim()}`;
        links.push({ type: 'X' as const, url: twitterUrl });
      }
      
      // Website URL - use OTHER type
      if (formData.website && formData.website.trim()) {
        const websiteUrl = formData.website.trim().startsWith('http') 
          ? formData.website.trim()
          : `https://${formData.website.trim()}`;
        links.push({ type: 'OTHER' as const, url: websiteUrl });
      }

      const updateData: UpdateProfileRequest = {
        bio: formData.bio || '', // Send empty string if no bio
        links: links, // Send the links array (can be empty)
      };

      console.log('Sending profile update:', JSON.stringify(updateData, null, 2));

      await foundersApi.updateProfile(updateData);
      
      // Refresh user data from server
      await refreshUser();
      
      // Invalidate AI-ranked queries if user has AI ranking enabled
      // This ensures personalized rankings refresh immediately
      const hadAIEnabled = getAIPreference();
      if (hadAIEnabled) {
        console.log('[ProfilePage] AI ranking enabled - invalidating AI-ranked caches');
        invalidateAIRankings();
        toast.success('Profile updated! Your personalized rankings are being refreshed...', {
          duration: 4000,
          icon: '✨',
        });
      }
      
      // Wait a moment for context to update, then update form
      setTimeout(() => {
        if (user) {
          setFormData({
            founderName: user.founderName,
            startupName: user.startupName,
            city: user.city,
            stageId: user.stage?.id || '',
            sectorId: user.sector?.id || '',
            bio: user.profile?.bio || user.bio || '',
            website: user.profile?.links?.find(l => l.type === 'OTHER')?.url || user.website || '',
            linkedInUrl: user.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user.linkedInUrl || '',
            twitterUrl: user.profile?.links?.find(l => l.type === 'X')?.url || user.twitterUrl || '',
          });
        }
      }, 100);
      
      setSuccess(true);
      setIsEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(parseApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-serif font-bold text-ink">Your Profile</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
          <p className="text-muted-text">Manage your account information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-light border-l-4 border-green text-green-dark">
            <p className="font-semibold">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-light border-l-4 border-rose text-rose">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-paper-light border border-line p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#f5f3ed] border-2 border-line flex items-center justify-center">
                <span className="text-3xl font-serif font-bold text-[#b58c4f]">
                  {user.founderName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
            </div>
            
            {/* Header Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-bold text-ink mb-1">{user.founderName}</h2>
              <p className="text-lg text-muted-text mb-3">{user.startupName}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-text">
                  <MapPin className="w-4 h-4" />
                  <span>{user.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-text">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information Card */}
          <div className="bg-paper-light border border-line p-6">
            <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-3 border-b border-line">
              Basic Information
            </h3>
            <div className="space-y-4">
              {/* Founder Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Your Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.founderName}
                      disabled
                      className="w-full px-3 py-2 border border-line bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                      placeholder="Enter your name"
                    />
                    <p className="text-xs text-muted-text mt-1">Set during onboarding</p>
                  </div>
                ) : (
                  <p className="text-ink">{user.founderName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Email Address
                </label>
                <p className="text-ink">{user.email}</p>
                <p className="text-xs text-muted-text mt-1">Email cannot be changed</p>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="Enter city"
                  />
                ) : (
                  <p className="text-ink">{user.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Startup Information Card */}
          <div className="bg-paper-light border border-line p-6">
            <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-3 border-b border-line">
              Startup Information
            </h3>
            <div className="space-y-4">
              {/* Startup Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Startup Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.startupName}
                    onChange={(e) => handleInputChange('startupName', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="Enter startup name"
                  />
                ) : (
                  <p className="text-ink">{user.startupName}</p>
                )}
              </div>

              {/* Stage */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Stage
                </label>
                {isEditing ? (
                  <select
                    value={formData.stageId}
                    onChange={(e) => handleInputChange('stageId', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    disabled={stagesLoading}
                  >
                    <option value="">Select stage</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-ink">{user.stageName || user.stage?.name || 'Not specified'}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Sector
                </label>
                {isEditing ? (
                  <select
                    value={formData.sectorId}
                    onChange={(e) => handleInputChange('sectorId', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    disabled={sectorsLoading}
                  >
                    <option value="">Select sector</option>
                    {sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-ink">{user.sectorName || user.sector?.name || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio Card - Full Width */}
          <div className="lg:col-span-2 bg-paper-light border border-line p-6">
            <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-3 border-b border-line">
              About
            </h3>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-2">
                Bio
              </label>
              {isEditing ? (
                <div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="Tell us about yourself and your startup..."
                  />
                  <p className="text-xs text-muted-text mt-1">
                    {formData.bio.length}/2000 characters
                  </p>
                </div>
              ) : (
                <p className="text-ink whitespace-pre-wrap">{user.profile?.bio || user.bio || 'Not specified'}</p>
              )}
            </div>
          </div>

          {/* Links Card - Full Width */}
          <div className="lg:col-span-2 bg-paper-light border border-line p-6">
            <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-3 border-b border-line">
              Links & Social
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Website */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="https://example.com"
                  />
                ) : (
                  (user.profile?.links?.find(l => l.type === 'OTHER')?.url || user.website) ? (
                    <a 
                      href={user.profile?.links?.find(l => l.type === 'OTHER')?.url || user.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#b58c4f] hover:text-[#94651f] text-sm flex items-center gap-1 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      <span className="truncate">{user.profile?.links?.find(l => l.type === 'OTHER')?.url || user.website}</span>
                    </a>
                  ) : (
                    <p className="text-ink text-sm">Not specified</p>
                  )
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  LinkedIn
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.linkedInUrl}
                    onChange={(e) => handleInputChange('linkedInUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="https://linkedin.com/in/..."
                  />
                ) : (
                  (user.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user.linkedInUrl) ? (
                    <a 
                      href={user.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user.linkedInUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#b58c4f] hover:text-[#94651f] text-sm flex items-center gap-1 transition-colors"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate">{user.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user.linkedInUrl}</span>
                    </a>
                  ) : (
                    <p className="text-ink text-sm">Not specified</p>
                  )
                )}
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wide text-muted-text mb-1">
                  Twitter/X
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                    placeholder="https://twitter.com/..."
                  />
                ) : (
                  (user.profile?.links?.find(l => l.type === 'X')?.url || user.twitterUrl) ? (
                    <a 
                      href={user.profile?.links?.find(l => l.type === 'X')?.url || user.twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#b58c4f] hover:text-[#94651f] text-sm flex items-center gap-1 transition-colors"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate">{user.profile?.links?.find(l => l.type === 'X')?.url || user.twitterUrl}</span>
                    </a>
                  ) : (
                    <p className="text-ink text-sm">Not specified</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-ink text-paper-light font-semibold rounded-lg hover:bg-[#304258] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-transparent border-2 border-ink text-ink font-semibold rounded-lg hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}

        {/* Pitch Deck Card */}
        <div className="mt-6 bg-paper-light border border-line p-6">
          <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-3 border-b border-line">
            Pitch Deck
          </h3>
          <PitchDeckUpload
            currentDeckUrl={pitchDeckUrl || undefined}
            onUploadSuccess={(url) => {
              setPitchDeckUrl(url);
              localStorage.setItem('pitchDeckUrl', url);
            }}
            onDeleteSuccess={() => {
              setPitchDeckUrl(null);
              localStorage.removeItem('pitchDeckUrl');
            }}
          />
        </div>

        {/* Account Settings Card */}
        <div className="mt-6 bg-[#f5f3ed] border border-line p-6">
          <h3 className="text-lg font-serif font-bold text-ink mb-3">
            Account Settings
          </h3>
          <Link
            to="/profile/security"
            className="inline-flex items-center gap-2 text-ink hover:text-[#b58c4f] font-medium transition-colors"
          >
            Security Settings
            <span className="text-[#b58c4f]">→</span>
          </Link>
          <p className="text-sm text-muted-text mt-2">
            Manage your password and sign-in methods
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
