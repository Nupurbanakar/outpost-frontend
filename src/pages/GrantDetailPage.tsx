import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { grantsApi, Grant } from '@/api/endpoints/grants';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { GrantHeader } from '@/components/grants/GrantHeader';
import { GrantKeyInfo } from '@/components/grants/GrantKeyInfo';
import { GrantContentSection } from '@/components/grants/GrantContentSection';
import { ExpiredBanner } from '@/components/common/ExpiredBanner';

export default function GrantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [grant, setGrant] = useState<Grant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchGrant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await grantsApi.getGrantById(id);
        setGrant(data);
      } catch (err: any) {
        console.error('Failed to fetch grant:', err);
        if (err.response?.status === 404) {
          setError('Grant not found');
        } else {
          setError('Failed to load grant details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrant();
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

  if (error || !grant) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            {error === 'Grant not found' ? 'Grant Not Found' : 'Error'}
          </h1>
          <p className="text-muted-text mb-8">
            {error === 'Grant not found' 
              ? 'The grant you are looking for does not exist or has been removed.'
              : error || 'An unexpected error occurred.'
            }
          </p>
          <button
            onClick={() => navigate('/grants')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Grants
          </button>
        </div>
      </AppLayout>
    );
  }

  const isExpired = grant.status === 'EXPIRED';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-text">
          <Link to="/grants" className="hover:text-ink transition-colors">
            Grants
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{grant.title}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-ink mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Expired Banner */}
        {isExpired && <ExpiredBanner />}

        {/* Header */}
        <GrantHeader
          title={grant.title}
          type={grant.type}
          issuingBody={grant.issuingBody}
        />

        {/* Key Info Cards */}
        <GrantKeyInfo grant={grant} />

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Summary */}
          <GrantContentSection title="Summary" content={grant.summary} />

          {/* Eligibility Criteria */}
          {grant.eligibilityCriteria && (
            <GrantContentSection title="Eligibility" content={grant.eligibilityCriteria} />
          )}

          {/* What's Funded */}
          {grant.whatsFunded && (
            <GrantContentSection title="What's Funded" content={grant.whatsFunded} />
          )}

          {/* How to Apply */}
          {grant.howToApply && (
            <GrantContentSection title="How to Apply" content={grant.howToApply} />
          )}
        </div>

        {/* Primary CTA */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <a
            href={grant.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold transition-colors ${
              isExpired
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-ink text-paper-light hover:bg-[#304258]'
            }`}
            onClick={(e) => isExpired && e.preventDefault()}
          >
            <span>Go to Source</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          
          <button
            onClick={() => navigate('/grants')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-ink text-ink font-semibold hover:bg-[#f5f3ed] transition-colors"
          >
            Browse More Grants
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
