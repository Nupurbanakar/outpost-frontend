import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts';
import { useStages, useSectors } from '@/hooks';
import { foundersApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ApiErrorDisplay } from '@/components/ApiErrorDisplay';
import { isErrorCode } from '@/utils/errorHandling';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function OnboardingPageMultiStep() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const { stages, isLoading: isLoadingStages, error: stagesError } = useStages();
  const { sectors, isLoading: isLoadingSectors, error: sectorsError } = useSectors();

  const [currentStep, setCurrentStep] = useState(1);
  const [founderName, setFounderName] = useState('');
  const [startupName, setStartupName] = useState('');
  const [stageId, setStageId] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;
  const isLoadingData = isLoadingStages || isLoadingSectors;

  // Show error if lookups failed
  if (stagesError || sectorsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper p-4">
        <div className="text-center">
          <p className="text-rose-600 mb-4">Failed to load form data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!founderName.trim()) {
        newErrors.founderName = 'Your name is required';
      }
      if (!startupName.trim()) {
        newErrors.startupName = 'Startup name is required';
      }
    }

    if (step === 2) {
      if (!stageId) {
        newErrors.stageId = 'Stage is required';
      }
      if (!sectorId) {
        newErrors.sectorId = 'Sector is required';
      }
    }

    if (step === 3) {
      if (website && !/^https?:\/\/.+/.test(website)) {
        newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({}); // Clear errors when moving to next step
      setApiError(null); // Clear any API errors too
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        founderName,
        startupName,
        stageId,
        sectorId,
        city,
        website: website || undefined,
      };
      console.log('=== ONBOARDING SUBMISSION ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('StageId:', stageId, '(type:', typeof stageId, ')');
      console.log('SectorId:', sectorId, '(type:', typeof sectorId, ')');
      console.log('Access Token:', localStorage.getItem('accessToken')?.substring(0, 20) + '...');
      
      await foundersApi.completeOnboarding(payload);
      console.log('Onboarding completed successfully');

      try {
        await refreshUser();
        console.log('User data refreshed');
      } catch (refreshError) {
        console.warn('Failed to refresh user data, but continuing:', refreshError);
      }

      toast.success('Profile completed!');
      console.log('Redirecting to /discover...');
      window.location.href = '/discover';
    } catch (error) {
      console.error('Onboarding failed:', error);
      console.log('Error type:', error);
      console.log('Error response:', (error as any)?.response?.data);
      console.log('Error code:', (error as any)?.response?.data?.code);

      const isAlreadyOnboarded = isErrorCode(error, 'ALREADY_ONBOARDED');
      const is409Conflict = (error as any)?.response?.status === 409;

      if (isAlreadyOnboarded || is409Conflict) {
        toast.success('Profile already completed!');
        window.location.href = '/discover';
        return;
      }

      // Check for UUID parsing error (backend issue)
      const errorMessage = (error as any)?.response?.data?.message || 
                          (error as any)?.response?.data?.detail || 
                          (error as any)?.message || '';
      
      if (errorMessage.includes('Invalid UUID') || errorMessage.includes('IllegalArgumentException')) {
        toast.error(
          'Authentication Error',
          { 
            description: 'There was an issue with your session. Please try logging out and logging in again.',
            duration: 6000,
          }
        );
        console.error('UUID parsing error detected - likely backend JWT issue');
        
        // Show user-friendly error in UI
        setApiError({
          response: {
            data: {
              code: 'AUTH_SESSION_ERROR',
              message: 'Session Authentication Error',
              detail: 'There is a temporary issue with your login session. Please log out and log back in to continue.',
            }
          }
        });
        return;
      }

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
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`text-sm font-medium ${
                  step <= currentStep ? 'text-ink' : 'text-muted-text'
                }`}
              >
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Startup Details'}
                {step === 3 && 'Location'}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-paper-light border border-line p-8 shadow-auth">
          <form onSubmit={handleSubmit}>
            {/* API Error */}
            {apiError && <ApiErrorDisplay error={apiError} />}

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
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
                    autoFocus
                  />
                  {errors.founderName && (
                    <p className="mt-1 text-sm text-rose-600">{errors.founderName}</p>
                  )}
                </div>

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
                  />
                  {errors.startupName && (
                    <p className="mt-1 text-sm text-rose-600">{errors.startupName}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Startup Details */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="stageId" className="label">
                    Startup Stage *
                  </label>
                  <select
                    id="stageId"
                    value={stageId}
                    onChange={(e) => {
                      setStageId(e.target.value);
                      setErrors((prev) => ({ ...prev, stageId: '' }));
                    }}
                    className={`block w-full px-3 py-2 h-12 bg-[#fffdf8] border text-ink text-sm transition-all ${
                      errors.stageId ? 'border-rose-500' : 'border-[#ddd6c9]'
                    } focus:border-[#b58c4f] focus:ring-2 focus:ring-[rgba(214,155,66,0.12)] focus:outline-none`}
                  >
                    <option value="">Select a stage</option>
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

                <div>
                  <label htmlFor="sectorId" className="label">
                    Sector *
                  </label>
                  <select
                    id="sectorId"
                    value={sectorId}
                    onChange={(e) => {
                      setSectorId(e.target.value);
                      setErrors((prev) => ({ ...prev, sectorId: '' }));
                    }}
                    className={`block w-full px-3 py-2 h-12 bg-[#fffdf8] border text-ink text-sm transition-all ${
                      errors.sectorId ? 'border-rose-500' : 'border-[#ddd6c9]'
                    } focus:border-[#b58c4f] focus:ring-2 focus:ring-[rgba(214,155,66,0.12)] focus:outline-none`}
                  >
                    <option value="">Select a sector</option>
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
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="city" className="label">
                    City
                  </label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bangalore"
                  />
                </div>

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
                    placeholder="https://yourstartup.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-rose-600">{errors.website}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <Button type="button" variant="primary" onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Completing...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
