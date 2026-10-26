import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { foundersApi, lookupsApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { isErrorCode } from '@/utils/errorHandling';
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
      const onboardingData = {
        founderName: founderName.trim(),
        startupName: startupName.trim(),
        stageId,
        sectorId,
        city: city.trim(),
        website: website.trim() || undefined,
      };
      
      console.log('Submitting onboarding data:', onboardingData);
      console.log('City value:', `"${onboardingData.city}"`, 'Length:', onboardingData.city.length);
      
      await foundersApi.completeOnboarding(onboardingData);
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
      console.log('Error type:', error);
      console.log('Error response:', (error as any)?.response?.data);
      console.log('Error code:', (error as any)?.response?.data?.code);
      
      // Extract validation errors from backend response
      const validationErrors = (error as any)?.response?.data?.errors;
      if (validationErrors && Array.isArray(validationErrors)) {
        console.error('🚨 VALIDATION ERRORS FROM BACKEND:');
        const fieldErrors: Record<string, string> = {};
        validationErrors.forEach((err: any, index: number) => {
          console.error(`   ${index + 1}. Field: "${err.field}", Message: "${err.message}"`);
          // Map backend field errors to frontend errors state
          fieldErrors[err.field] = err.message;
        });
        // Set field-level errors so they appear under each field
        setErrors(fieldErrors);
        // Don't show ApiErrorDisplay for validation errors, just field errors
        if (validationErrors.length > 0) {
          toast.error('Please check the form for errors');
          setIsSubmitting(false);
          return;
        }
      }
      
      // If already onboarded, just redirect to discover
      const isAlreadyOnboarded = isErrorCode(error, 'ALREADY_ONBOARDED');
      const is409Conflict = (error as any)?.response?.status === 409;
      console.log('Is already onboarded?', isAlreadyOnboarded);
      console.log('Is 409 conflict?', is409Conflict);
      
      if (isAlreadyOnboarded || is409Conflict) {
        toast.success('Profile already completed!');
        console.log('Already onboarded, redirecting to /discover...');
        window.location.href = '/discover';
        return;
      }
      
      // Only set apiError for non-validation errors
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
                  setApiError(null);
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
                  setApiError(null);
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
                    setApiError(null);
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
                    setApiError(null);
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
                  setApiError(null);
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
                  setApiError(null);
                }}
                error={!!errors.website}
                placeholder="https://yourstartup.com"
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
