import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { foundersApi, lookupsApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import type { Stage, Sector } from '@/types';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  
  const [founderName, setFounderName] = useState('');
  const [startupName, setStartupName] = useState('');
  const [stageId, setStageId] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  
  const [stages, setStages] = useState<Stage[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load stages and sectors
  useEffect(() => {
    const loadData = async () => {
      try {
        const [stagesData, sectorsData] = await Promise.all([
          lookupsApi.getStages(),
          lookupsApi.getSectors(),
        ]);
        setStages(stagesData);
        setSectors(sectorsData);
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!founderName.trim()) newErrors.founderName = 'Founder name is required';
    if (!startupName.trim()) newErrors.startupName = 'Startup name is required';
    if (!stageId) newErrors.stageId = 'Please select a stage';
    if (!sectorId) newErrors.sectorId = 'Please select a sector';
    if (!city.trim()) newErrors.city = 'City is required';
    
    if (website && !/^https?:\/\/.+/.test(website)) {
      newErrors.website = 'Please enter a valid URL';
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
      console.log('Submitting onboarding data...');
      await foundersApi.completeOnboarding({
        founderName,
        startupName,
        stageId,
        sectorId,
        city,
        website: website || undefined,
      });
      console.log('Onboarding completed successfully');
      
      // Refresh user data to get updated isOnboarded status
      try {
        await refreshUser();
        console.log('User data refreshed');
      } catch (refreshError) {
        console.warn('Failed to refresh user data, but continuing:', refreshError);
        // Continue anyway since onboarding was successful
      }
      
      toast.success('Profile completed!');
      console.log('Redirecting to /discover...');
      
      // Use window.location for immediate redirect
      window.location.href = '/discover';
    } catch (error) {
      console.error('Onboarding failed:', error);
      setApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-ink mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-text">
            Tell us about yourself and your startup
          </p>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error */}
            {apiError && <ApiErrorDisplay error={apiError} />}

            {/* Founder Name */}
            <div>
              <label htmlFor="founderName" className="label">
                Your Name *
              </label>
              <Input
                id="founderName"
                value={founderName}
                onChange={(e) => {
                  setFounderName(e.target.value);
                  setErrors((prev) => ({ ...prev, founderName: '' }));
                }}
                error={!!errors.founderName}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.founderName && (
                <p className="mt-1 text-sm text-rose-600">{errors.founderName}</p>
              )}
            </div>

            {/* Startup Name */}
            <div>
              <label htmlFor="startupName" className="label">
                Startup Name *
              </label>
              <Input
                id="startupName"
                value={startupName}
                onChange={(e) => {
                  setStartupName(e.target.value);
                  setErrors((prev) => ({ ...prev, startupName: '' }));
                }}
                error={!!errors.startupName}
                placeholder="Acme Inc"
                disabled={isSubmitting}
              />
              {errors.startupName && (
                <p className="mt-1 text-sm text-rose-600">{errors.startupName}</p>
              )}
            </div>

            {/* Stage and Sector Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stage */}
              <div>
                <label htmlFor="stage" className="label">
                  Stage *
                </label>
                <select
                  id="stage"
                  value={stageId}
                  onChange={(e) => {
                    setStageId(e.target.value);
                    setErrors((prev) => ({ ...prev, stageId: '' }));
                  }}
                  className="input"
                  disabled={isSubmitting}
                >
                  <option value="">Select stage</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
                {errors.stageId && (
                  <p className="mt-1 text-sm text-rose-600">{errors.stageId}</p>
                )}
              </div>

              {/* Sector */}
              <div>
                <label htmlFor="sector" className="label">
                  Sector *
                </label>
                <select
                  id="sector"
                  value={sectorId}
                  onChange={(e) => {
                    setSectorId(e.target.value);
                    setErrors((prev) => ({ ...prev, sectorId: '' }));
                  }}
                  className="input"
                  disabled={isSubmitting}
                >
                  <option value="">Select sector</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
                {errors.sectorId && (
                  <p className="mt-1 text-sm text-rose-600">{errors.sectorId}</p>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="label">
                City *
              </label>
              <Input
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setErrors((prev) => ({ ...prev, city: '' }));
                }}
                error={!!errors.city}
                placeholder="Hyderabad"
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-rose-600">{errors.city}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="label">
                Website (Optional)
              </label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  setErrors((prev) => ({ ...prev, website: '' }));
                }}
                error={!!errors.website}
                placeholder="https://yourstartu p.com"
                disabled={isSubmitting}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-rose-600">{errors.website}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Completing...' : 'Complete Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
