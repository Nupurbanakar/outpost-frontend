import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { challengesApi, Challenge } from '@/api/endpoints/challenges';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChevronLeft, ExternalLink, Calendar, Building2, Tag } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { KeyInfoCard } from '@/components/common/KeyInfoCard';
import { GrantContentSection } from '@/components/grants/GrantContentSection';

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchChallenge = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await challengesApi.getChallengeById(id);
        setChallenge(data);
      } catch (err: any) {
        console.error('Failed to fetch challenge:', err);
        if (err.response?.status === 404) {
          setError('Challenge not found');
        } else {
          setError('Failed to load challenge details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error || !challenge) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            {error === 'Challenge not found' ? 'Challenge Not Found' : 'Error'}
          </h1>
          <p className="text-muted-text mb-8">
            {error === 'Challenge not found'
              ? 'The challenge you are looking for does not exist or has been removed.'
              : error || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => navigate('/challenges')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Challenges
          </button>
        </div>
      </AppLayout>
    );
  }

  const isClosed = challenge.status === 'CLOSED';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-text">
          <Link to="/challenges" className="hover:text-ink transition-colors">
            Challenges
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{challenge.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-ink mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Closed Banner */}
        {isClosed && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800">
            <p className="font-semibold">This challenge is closed</p>
            <p className="text-sm">
              Applications for this challenge are no longer being accepted.
            </p>
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide border bg-[#fef3e2] text-[#b58c4f] border-[#f4d8a8]">
              CHALLENGE
            </span>
          </div>

          {/* Corporate Logo and Name */}
          <div className="flex items-center gap-4 mb-4">
            {challenge.corporateLogo && (
              <img
                src={challenge.corporateLogo}
                alt={challenge.corporateName}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <p className="text-lg text-muted-text flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {challenge.corporateName}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-3">
            {challenge.title}
          </h1>
        </header>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Deadline */}
          {challenge.deadline && (
            <KeyInfoCard icon={Calendar} label="Deadline">
              {formatDate(challenge.deadline)}
            </KeyInfoCard>
          )}

          {/* Theme */}
          {challenge.theme && (
            <KeyInfoCard icon={Tag} label="Theme">
              {challenge.theme}
            </KeyInfoCard>
          )}

          {/* Sector */}
          {challenge.sector && (
            <KeyInfoCard icon={Tag} label="Sector">
              {challenge.sector.name}
            </KeyInfoCard>
          )}

          {/* Offer Type */}
          {challenge.offerType && (
            <KeyInfoCard icon={Tag} label="Offer Type">
              {challenge.offerType}
            </KeyInfoCard>
          )}
        </div>

        {/* Content Sections - Only if hasDetail */}
        {challenge.hasDetail ? (
          <div className="space-y-8">
            {/* Problem Statement */}
            {challenge.problemStatement && (
              <GrantContentSection
                title="Problem Statement"
                content={challenge.problemStatement}
              />
            )}

            {/* What They're Looking For */}
            {challenge.whatTheyAreLookingFor && (
              <GrantContentSection
                title="What They're Looking For"
                content={challenge.whatTheyAreLookingFor}
              />
            )}

            {/* Eligibility Criteria */}
            {challenge.eligibilityCriteria && (
              <GrantContentSection
                title="Eligibility"
                content={challenge.eligibilityCriteria}
              />
            )}

            {/* Timeline */}
            {challenge.timeline && (
              <GrantContentSection title="Timeline" content={challenge.timeline} />
            )}
          </div>
        ) : (
          /* No Detail Message */
          <div className="bg-[#f5f3ed] border border-line p-8 text-center">
            <p className="text-muted-text mb-4">
              Full details for this challenge are available on the corporate's website.
            </p>
            <a
              href={challenge.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
            >
              <span>View Full Details</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Primary CTA */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href={challenge.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold transition-colors ${
              isClosed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-ink text-paper-light hover:bg-[#304258]'
            }`}
            onClick={(e) => isClosed && e.preventDefault()}
          >
            <span>Apply Now</span>
            <ExternalLink className="w-5 h-5" />
          </a>

          <button
            onClick={() => navigate('/challenges')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-[#f5f3ed] transition-colors"
          >
            Browse More Challenges
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
