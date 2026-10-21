import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/contexts';
import { foundersApi, UpdateProfileRequest } from '@/api/endpoints/founders';
import { useStages } from '@/hooks/useStages';
import { useSectors } from '@/hooks/useSectors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PitchDeckUpload } from '@/components/profile/PitchDeckUpload';
import { parseApiError } from '@/utils/errorHandling';
import { User, Building2, MapPin, Target, Briefcase, Mail, Edit, Save, X, FileText, Globe, Link as LinkIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { stages, isLoading: stagesLoading } = useStages();
  const { sectors, isLoading: sectorsLoading } = useSectors();

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
    stageId: user?.stage?.id || '',
    sectorId: user?.sector?.id || '',
    bio: user?.profile?.bio || user?.bio || '',
    website: user?.profile?.links?.find(l => l.type === 'OTHER')?.url || user?.website || '',
    linkedInUrl: user?.profile?.links?.find(l => l.type === 'LINKEDIN')?.url || user?.linkedInUrl || '',
    twitterUrl: user?.profile?.links?.find(l => l.type === 'X')?.url || user?.twitterUrl || '',
  });

  useEffect(() => {
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
      
      // Load pitch deck
      loadPitchDeck();
    }
  }, [user]);

  const loadPitchDeck = async () => {
    try {
      const data = await foundersApi.getPitchDeck();
      setPitchDeckUrl(data.url);
    } catch (err: any) {
      // No pitch deck uploaded yet or endpoint not implemented, ignore 404
      if (err.response?.status === 404) {
        // Silently ignore - pitch deck not uploaded or endpoint not implemented
        setPitchDeckUrl(null);
      } else {
        console.error('Error loading pitch deck:', err);
        setPitchDeckUrl(null);
      }
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
      await refreshUser();
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-2">Your Profile</h1>
            <p className="text-muted-text">Manage your account information</p>
          </div>
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

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
            <p className="font-semibold">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-paper-light border border-line">
          {/* Email (Read-only) */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <Mail className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-1">
                  Email Address
                </label>
                <p className="text-lg text-ink">{user.email}</p>
                <p className="text-xs text-muted-text mt-1">
                  Email cannot be changed. Contact support if you need assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Founder Name */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <User className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Your Name
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={formData.founderName}
                      disabled
                      className="w-full px-4 py-2 border border-line bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Enter your name"
                    />
                    <p className="text-xs text-muted-text mt-1">Set during onboarding</p>
                  </div>
                ) : (
                  <p className="text-lg text-ink">{user.founderName}</p>
                )}
                {isEditing && (
                  <p className="text-xs text-muted-text mt-1">Name cannot be changed after onboarding</p>
                )}
              </div>
            </div>
          </div>

          {/* Startup Name */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <Building2 className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Startup Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.startupName}
                    onChange={(e) => handleInputChange('startupName', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                    placeholder="Enter startup name"
                  />
                ) : (
                  <p className="text-lg text-ink">{user.startupName}</p>
                )}
              </div>
            </div>
          </div>

          {/* City */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <MapPin className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                    placeholder="Enter city"
                  />
                ) : (
                  <p className="text-lg text-ink">{user.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stage */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <Target className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Stage
                </label>
                {isEditing ? (
                  <select
                    value={formData.stageId}
                    onChange={(e) => handleInputChange('stageId', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
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
                  <p className="text-lg text-ink">{user.stage?.name || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sector */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <Briefcase className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Sector
                </label>
                {isEditing ? (
                  <select
                    value={formData.sectorId}
                    onChange={(e) => handleInputChange('sectorId', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
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
                  <p className="text-lg text-ink">{user.sector?.name || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <FileText className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      maxLength={2000}
                      rows={4}
                      className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                      placeholder="Tell us about yourself and your startup..."
                    />
                    <p className="text-xs text-muted-text mt-1">
                      {formData.bio.length}/2000 characters
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-ink whitespace-pre-wrap">{user.bio || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Website */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <Globe className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  user.website ? (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-lg text-indigo-600 hover:text-indigo-700">
                      {user.website}
                    </a>
                  ) : (
                    <p className="text-lg text-ink">Not specified</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="p-6 border-b border-line">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <LinkIcon className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  LinkedIn URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.linkedInUrl}
                    onChange={(e) => handleInputChange('linkedInUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  user.linkedInUrl ? (
                    <a href={user.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-indigo-600 hover:text-indigo-700">
                      {user.linkedInUrl}
                    </a>
                  ) : (
                    <p className="text-lg text-ink">Not specified</p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Twitter */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#f5f3ed] rounded">
                <LinkIcon className="w-5 h-5 text-[#b58c4f]" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-text mb-2">
                  Twitter/X URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
                    placeholder="https://twitter.com/yourhandle"
                  />
                ) : (
                  user.twitterUrl ? (
                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-indigo-600 hover:text-indigo-700">
                      {user.twitterUrl}
                    </a>
                  ) : (
                    <p className="text-lg text-ink">Not specified</p>
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
              className="flex items-center gap-2 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-[#f5f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}

        {/* Additional Settings Links */}
        <div className="mt-8 p-6 bg-[#f5f3ed] border border-line">
          <h3 className="text-lg font-serif font-bold text-ink mb-4">Pitch Deck</h3>
          <PitchDeckUpload
            currentDeckUrl={pitchDeckUrl || undefined}
            onUploadSuccess={loadPitchDeck}
            onDeleteSuccess={() => setPitchDeckUrl(null)}
          />
        </div>

        {/* Additional Settings Links */}
        <div className="mt-8 p-6 bg-[#f5f3ed] border border-line">
          <h3 className="text-lg font-serif font-bold text-ink mb-4">Account Settings</h3>
          <div className="space-y-3">
            <Link
              to="/profile/security"
              className="block text-ink hover:text-[#b58c4f] font-medium transition-colors"
            >
              Security Settings →
            </Link>
            <p className="text-sm text-muted-text">
              Manage your password and sign-in methods
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
