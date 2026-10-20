import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { getBenefitById, Benefit } from '../api/endpoints/benefits';
import { formatDate } from '../utils/dateUtils';

export default function BenefitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [benefit, setBenefit] = useState<Benefit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [codeRevealed, setCodeRevealed] = useState(false);

  useEffect(() => {
    if (id) {
      loadBenefit(id);
    }
  }, [id]);

  const loadBenefit = async (benefitId: string) => {
    try {
      setIsLoading(true);
      const data = await getBenefitById(benefitId);
      setBenefit(data);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Benefit not found' : 'Failed to load benefit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (benefit?.claimCode) {
      navigator.clipboard.writeText(benefit.claimCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleRevealCode = () => {
    setCodeRevealed(true);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center text-gray-600">Loading benefit details...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !benefit) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{error || 'Benefit not found'}</h1>
            <Link to="/benefits" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
              ← Back to Benefits
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isExpired = benefit.status === 'EXPIRED';

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Link */}
        <Link
          to="/benefits"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Benefits
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          {/* Expired Badge */}
          {isExpired && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">This offer has expired</span>
            </div>
          )}

          {/* Partner Logo */}
          <div className="mb-6">
            {benefit.partnerLogoUrl ? (
              <img
                src={benefit.partnerLogoUrl}
                alt={benefit.partnerName}
                className="h-16 object-contain"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-900">{benefit.partnerName}</h3>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
              {benefit.category}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">{benefit.headline}</h1>

          {/* Validity */}
          {benefit.validUntil && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Valid until {formatDate(benefit.validUntil)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <p className="text-gray-700 whitespace-pre-wrap">{benefit.description}</p>
        </section>

        {/* What You Get */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">What You Get</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: benefit.whatYouGet.replace(/\n/g, '<br />') }} />
          </div>
        </section>

        {/* Eligibility */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Eligibility</h2>
          <div className="prose prose-sm max-w-none text-gray-700">
            <div dangerouslySetInnerHTML={{ __html: benefit.eligibility.replace(/\n/g, '<br />') }} />
          </div>
        </section>

        {/* How to Claim */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">How to Claim</h2>
          <div className="prose prose-sm max-w-none text-gray-700 mb-6">
            <div dangerouslySetInnerHTML={{ __html: benefit.howToClaim.replace(/\n/g, '<br />') }} />
          </div>

          {/* Claim CTA */}
          {!isExpired && (
            <div className="space-y-4">
              {/* Link CTA */}
              {benefit.claimUrl && (
                <a
                  href={benefit.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Claim This Offer
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {/* Code Reveal */}
              {benefit.claimCode && (
                <div>
                  {!codeRevealed ? (
                    <button
                      onClick={handleRevealCode}
                      className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors"
                    >
                      Reveal Promo Code
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 px-6 py-3 font-mono text-lg font-bold text-indigo-900">
                        {benefit.claimCode}
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {codeCopied ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
