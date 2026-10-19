import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { mentorsApi, MentorApplicationRequest } from '@/api/endpoints/mentors';
import { parseApiError } from '@/utils/errorHandling';
import { CheckCircle, User, Briefcase, Mail, Link as LinkIcon, Calendar } from 'lucide-react';

const EXPERTISE_OPTIONS = [
  'Product',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Fundraising',
  'Operations',
  'Strategy',
  'Legal',
  'Finance',
  'HR',
  'Growth',
];

const applicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  headline: z.string().min(10, 'Headline must be at least 10 characters'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  calComUrl: z.string().url('Must be a valid Cal.com URL').includes('cal.com', {
    message: 'Must be a Cal.com URL',
  }),
  photoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedInUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  expertise: z.array(z.string()).min(1, 'Select at least one area of expertise'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function MentorApplicationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      expertise: [],
    },
  });

  const toggleExpertise = (area: string) => {
    const updated = selectedExpertise.includes(area)
      ? selectedExpertise.filter((e) => e !== area)
      : [...selectedExpertise, area];
    
    setSelectedExpertise(updated);
    setValue('expertise', updated);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const application: MentorApplicationRequest = {
        name: data.name,
        email: data.email,
        headline: data.headline,
        bio: data.bio,
        calComUrl: data.calComUrl,
        expertise: data.expertise,
        photoUrl: data.photoUrl || undefined,
        linkedInUrl: data.linkedInUrl || undefined,
      };

      await mentorsApi.applyAsMentor(application);
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('An application with this email already exists. Please use a different email.');
      } else {
        setError(parseApiError(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-ink mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-muted-text mb-8">
              Thank you for applying to be a mentor. We'll review your application and get back to
              you within 3-5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/mentors')}
                className="px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
              >
                Browse Mentors
              </button>
              <button
                onClick={() => navigate('/discover')}
                className="px-6 py-3 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-[#f5f3ed] transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-3">Apply to be a Mentor</h1>
          <p className="text-lg text-muted-text">
            Share your expertise with the T-Hub founder community
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-6 bg-[#f0f9f4] border border-[#95d5b2]">
          <h3 className="font-semibold text-ink mb-2">What we're looking for</h3>
          <ul className="text-sm text-muted-text space-y-1 list-disc list-inside">
            <li>Experienced founders or operators (3+ years)</li>
            <li>Willingness to mentor 2-3 hours per month</li>
            <li>Domain expertise in one or more areas</li>
            <li>Based in India or available for virtual sessions</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </div>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </div>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Professional Headline *
              </div>
            </label>
            <input
              {...register('headline')}
              type="text"
              id="headline"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="e.g., Ex-VP Product at Flipkart | 3x Founder"
            />
            {errors.headline && (
              <p className="text-sm text-red-600 mt-1">{errors.headline.message}</p>
            )}
            <p className="text-xs text-muted-text mt-1">This will be displayed on your mentor card</p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-ink mb-2">
              Bio *
            </label>
            <textarea
              {...register('bio')}
              id="bio"
              rows={5}
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="Tell us about your background, experience, and what you can help founders with..."
            />
            {errors.bio && <p className="text-sm text-red-600 mt-1">{errors.bio.message}</p>}
            <p className="text-xs text-muted-text mt-1">Minimum 50 characters</p>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-ink mb-3">
              Areas of Expertise * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {EXPERTISE_OPTIONS.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-2 cursor-pointer p-3 border border-line hover:bg-[#f5f3ed] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedExpertise.includes(area)}
                    onChange={() => toggleExpertise(area)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-ink">{area}</span>
                </label>
              ))}
            </div>
            {errors.expertise && (
              <p className="text-sm text-red-600 mt-2">{errors.expertise.message}</p>
            )}
          </div>

          {/* Cal.com URL */}
          <div>
            <label htmlFor="calComUrl" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Cal.com Booking URL *
              </div>
            </label>
            <input
              {...register('calComUrl')}
              type="url"
              id="calComUrl"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="https://cal.com/yourname"
            />
            {errors.calComUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.calComUrl.message}</p>
            )}
            <p className="text-xs text-muted-text mt-1">
              Founders will use this to book sessions with you. Don't have one?{' '}
              <a
                href="https://cal.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline"
              >
                Create free account
              </a>
            </p>
          </div>

          {/* Photo URL (Optional) */}
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Photo URL (Optional)
              </div>
            </label>
            <input
              {...register('photoUrl')}
              type="url"
              id="photoUrl"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="https://example.com/your-photo.jpg"
            />
            {errors.photoUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.photoUrl.message}</p>
            )}
          </div>

          {/* LinkedIn URL (Optional) */}
          <div>
            <label htmlFor="linkedInUrl" className="block text-sm font-medium text-ink mb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                LinkedIn Profile (Optional)
              </div>
            </label>
            <input
              {...register('linkedInUrl')}
              type="url"
              id="linkedInUrl"
              className="w-full px-4 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-ink"
              placeholder="https://linkedin.com/in/yourprofile"
            />
            {errors.linkedInUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.linkedInUrl.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-[#f5f3ed] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
