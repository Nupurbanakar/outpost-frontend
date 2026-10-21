import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { mentorsApi, Mentor } from '@/api/endpoints/mentors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChevronLeft, Calendar, ExternalLink, Globe, Mail } from 'lucide-react';

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMentor = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await mentorsApi.getMentorById(id);
        setMentor(data);
      } catch (err: any) {
        console.error('Failed to fetch mentor:', err);
        if (err.response?.status === 404) {
          setError('Mentor not found');
        } else {
          setError('Failed to load mentor details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
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

  if (error || !mentor) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-ink mb-4">
            {error === 'Mentor not found' ? 'Mentor Not Found' : 'Error'}
          </h1>
          <p className="text-muted-text mb-8">
            {error === 'Mentor not found'
              ? 'The mentor profile you are looking for does not exist or has been removed.'
              : error || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => navigate('/mentors')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Mentors
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-text">
          <Link to="/mentors" className="hover:text-ink transition-colors">
            Mentors
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{mentor.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-ink mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <header className="mb-8">
              {/* Photo */}
              <div className="mb-6">
                {mentor.photoUrl ? (
                  <img
                    src={mentor.photoUrl}
                    alt={mentor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#f5f3ed] flex items-center justify-center text-4xl font-bold text-[#b58c4f]">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Name and Headline */}
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-3">
                {mentor.name}
              </h1>
              <p className="text-xl text-[#2d6a4f] font-medium mb-4">{mentor.headline}</p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {mentor.linkedInUrl && (
                  <a
                    href={mentor.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-text hover:text-ink transition-colors"
                    aria-label="LinkedIn"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                {mentor.twitterUrl && (
                  <a
                    href={mentor.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-text hover:text-ink transition-colors"
                    aria-label="Twitter"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                {mentor.websiteUrl && (
                  <a
                    href={mentor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-text hover:text-ink transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </header>

            {/* Expertise Tags */}
            {mentor.expertise && mentor.expertise.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-serif font-bold text-ink mb-3">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#f5f3ed] text-ink text-sm font-medium border border-line"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-ink mb-4">About</h2>
              <div className="prose max-w-none text-muted-text whitespace-pre-line">
                {mentor.bio}
              </div>
            </section>

            {/* Experience */}
            {mentor.experience && (
              <section className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-ink mb-4">Experience</h2>
                <div className="prose max-w-none text-muted-text whitespace-pre-line">
                  {mentor.experience}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Booking */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-[#f5f3ed] border border-line p-6 sticky top-8">
              <h3 className="text-xl font-serif font-bold text-ink mb-3">
                Book a Session
              </h3>
              <p className="text-sm text-muted-text mb-6">
                Schedule a 1-on-1 mentoring session to get personalized guidance
              </p>

              {/* Cal.com Integration */}
              <div className="mb-6">
                <a
                  href={mentor.calComUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule via Cal.com</span>
                </a>
              </div>

              <div className="text-xs text-muted-text">
                <p className="mb-2">
                  <strong>What to expect:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>30-60 minute sessions</li>
                  <li>Video call via preferred platform</li>
                  <li>Personalized advice for your startup</li>
                  <li>Actionable next steps</li>
                </ul>
              </div>

              {/* Alternative Contact */}
              <div className="mt-6 pt-6 border-t border-line">
                <p className="text-xs text-muted-text text-center">
                  Questions about mentorship?{' '}
                  <a
                    href="mailto:mentors@outpost.com"
                    className="text-ink hover:underline font-medium"
                  >
                    Contact us
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
