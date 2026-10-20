import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Mail, Phone, Download } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { getCandidateById, Candidate } from '../api/endpoints/candidates';

const experienceLevelLabels = {
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Lead/Principal',
};

const availabilityLabels = {
  IMMEDIATE: 'Immediate',
  TWO_WEEKS: '2 Weeks Notice',
  ONE_MONTH: '1 Month Notice',
  FLEXIBLE: 'Flexible',
};

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCandidate(id);
    }
  }, [id]);

  const loadCandidate = async (candidateId: string) => {
    try {
      setIsLoading(true);
      const data = await getCandidateById(candidateId);
      setCandidate(data);
    } catch (err: any) {
      setError(
        err.response?.status === 404 ? 'Candidate not found' : 'Failed to load candidate profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center text-gray-600">Loading candidate profile...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !candidate) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{error || 'Candidate not found'}</h1>
            <Link to="/talent" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
              ← Back to Talent Pool
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Link */}
        <Link
          to="/talent"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Talent Pool
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{candidate.name}</h1>
          <p className="mb-4 text-xl text-gray-700">{candidate.role}</p>

          {/* Metadata */}
          <div className="mb-6 flex flex-wrap gap-4">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700">
              {experienceLevelLabels[candidate.experienceLevel]}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{availabilityLabels[candidate.availability]}</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            {candidate.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${candidate.email}`}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  {candidate.email}
                </a>
              </div>
            )}
            {candidate.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href={`tel:${candidate.phone}`} className="text-indigo-600 hover:text-indigo-700">
                  {candidate.phone}
                </a>
              </div>
            )}
          </div>

          {/* Resume Download */}
          {candidate.resumeUrl && (
            <div className="mt-6">
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download Resume
              </a>
            </div>
          )}
        </div>

        {/* Skills */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Summary/Bio */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{candidate.summary}</p>
        </section>
      </div>
    </AppLayout>
  );
}
