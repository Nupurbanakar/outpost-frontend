import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { mentorsApi, Mentor } from '@/api/endpoints/mentors';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
      <div className="bg-paper-light min-h-screen">
        {/* Breadcrumb */}
        <div className="border-b border-line bg-paper-light">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-text">
              <Link to="/mentors" className="hover:text-ink transition-colors">
                Mentors
              </Link>
              <span>/</span>
              <span className="text-ink font-medium">{mentor.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-ink mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Profile Header Card */}
          <Card className="mb-6 p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {mentor.photoUrl ? (
                  <img
                    src={mentor.photoUrl}
                    alt={mentor.name}
                    className="w-40 h-40 rounded-full object-cover border-4 border-[#f5f3ed]"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-[#f5f3ed] flex items-center justify-center text-5xl font-bold text-[#b58c4f] border-4 border-line">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Name, Headline, Actions */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-2">
                    {mentor.name}
                  </h1>
                  <p className="text-xl text-green-dark font-medium mb-6">
                    {mentor.headline}
                  </p>

                  {/* Social Links as Icon Buttons */}
                  <div className="flex items-center gap-3">
                    {mentor.linkedInUrl && (
                      <a
                        href={mentor.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-[#f5f3ed] text-ink hover:bg-line transition-colors"
                        aria-label="LinkedIn Profile"
                        title="LinkedIn Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {mentor.twitterUrl && (
                      <a
                        href={mentor.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-[#f5f3ed] text-ink hover:bg-line transition-colors"
                        aria-label="Twitter Profile"
                        title="Twitter Profile"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {mentor.websiteUrl && (
                      <a
                        href={mentor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 bg-[#f5f3ed] text-ink hover:bg-line transition-colors"
                        aria-label="Personal Website"
                        title="Personal Website"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Primary Action */}
                <div className="mt-6 md:mt-0">
                  <a
                    href={mentor.calComUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-ink text-paper-light font-semibold hover:bg-[#304258] transition-colors w-full md:w-auto"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book a Session</span>
                  </a>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card>
                <h2 className="text-2xl font-serif font-bold text-ink mb-4">About</h2>
                <div className="text-muted-text leading-relaxed whitespace-pre-line">
                  {mentor.bio}
                </div>
              </Card>

              {/* Experience Section */}
              {mentor.experience && (
                <Card>
                  <h2 className="text-2xl font-serif font-bold text-ink mb-4">Experience</h2>
                  <div className="text-muted-text leading-relaxed whitespace-pre-line">
                    {mentor.experience}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Expertise Card */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <Card>
                  <h2 className="text-xl font-serif font-bold text-ink mb-4">Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((tag, index) => (
                      <Badge key={index} variant="tag" className="px-3 py-1.5 border border-line">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Session Info Card */}
              <Card className="bg-[#f5f3ed]">
                <h3 className="text-lg font-serif font-bold text-ink mb-3">
                  What to Expect
                </h3>
                <ul className="space-y-3 text-sm text-muted-text">
                  <li className="flex items-start gap-2">
                    <span className="text-green-dark mt-0.5">•</span>
                    <span>30-60 minute personalized sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-dark mt-0.5">•</span>
                    <span>Video call via your preferred platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-dark mt-0.5">•</span>
                    <span>Expert advice tailored to your startup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-dark mt-0.5">•</span>
                    <span>Actionable next steps and guidance</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-line">
                  <p className="text-xs text-muted-text text-center">
                    Questions about mentorship?{' '}
                    <a
                      href="mailto:mentors@outpost.com"
                      className="text-ink hover:text-gold-dark font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Contact us
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
