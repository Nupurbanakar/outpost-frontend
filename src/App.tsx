import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { SkipLink } from './components/SkipLink';

// Pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerifyPage from './pages/VerifyPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import OnboardingPage from './pages/OnboardingPageMultiStep';
import DiscoverPage from './pages/DiscoverPage';
import GrantsPage from './pages/GrantsPage';
import GrantDetailPage from './pages/GrantDetailPage';
import ChallengesPage from './pages/ChallengesPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import MentorsPage from './pages/MentorsPage';
import MentorDetailPage from './pages/MentorDetailPage';
import MentorApplicationPage from './pages/MentorApplicationPage';
import ProfilePage from './pages/ProfilePage';
import SecuritySettingsPage from './pages/SecuritySettingsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SavedItemsPage from './pages/SavedItemsPage';
import PublicFounderProfilePage from './pages/PublicFounderProfilePage';
import BenefitsPage from './pages/BenefitsPage';
import BenefitDetailPage from './pages/BenefitDetailPage';
import TalentPage from './pages/TalentPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminGrantsPage from './pages/admin/AdminGrantsPage';
import AdminChallengesPage from './pages/admin/AdminChallengesPage';
import AdminMentorsPage from './pages/admin/AdminMentorsPage';
import AdminSpotlightPage from './pages/admin/AdminSpotlightPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isOpen, close } = useGlobalSearch();
  
  return (
    <>
      <SkipLink />
      <GlobalSearchModal isOpen={isOpen} onClose={close} />
      <Routes>
      {/* Public landing page */}
      <Route path="/" element={<HomePage />} />
      
      {/* Test page (development only) */}
      <Route path="/test" element={<TestPage />} />
      
      {/* Public auth routes - redirect to /discover if authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      
      {/* Verification routes - public */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      
      {/* OAuth callback - public */}
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />
      
      {/* Password reset routes - public */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Onboarding - requires auth but not onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireOnboarded={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes - require auth and onboarding */}
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <DiscoverPage />
          </ProtectedRoute>
        }
      />
      
      {/* Grants listing */}
      <Route
        path="/grants"
        element={
          <ProtectedRoute>
            <GrantsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Grant detail */}
      <Route
        path="/grants/:id"
        element={
          <ProtectedRoute>
            <GrantDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      
      {/* Security Settings */}
      <Route
        path="/profile/security"
        element={
          <ProtectedRoute>
            <SecuritySettingsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Challenges listing */}
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <ChallengesPage />
          </ProtectedRoute>
        }
      />
      
      {/* Challenge detail */}
      <Route
        path="/challenges/:id"
        element={
          <ProtectedRoute>
            <ChallengeDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Placeholder protected routes for future implementation */}
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <div className="p-8">Opportunities page (coming soon)</div>
          </ProtectedRoute>
        }
      />
      
      {/* Mentors listing */}
      <Route
        path="/mentors"
        element={
          <ProtectedRoute>
            <MentorsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Mentor detail */}
      <Route
        path="/mentors/:id"
        element={
          <ProtectedRoute>
            <MentorDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Mentor application form */}
      <Route
        path="/mentors/apply"
        element={
          <ProtectedRoute>
            <MentorApplicationPage />
          </ProtectedRoute>
        }
      />
      
      {/* Search results */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Saved items */}
      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedItemsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Public founder profile */}
      <Route
        path="/founders/:id"
        element={
          <ProtectedRoute>
            <PublicFounderProfilePage />
          </ProtectedRoute>
        }
      />
      
      {/* Benefits */}
      <Route
        path="/benefits"
        element={
          <ProtectedRoute>
            <BenefitsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Benefit detail */}
      <Route
        path="/benefits/:id"
        element={
          <ProtectedRoute>
            <BenefitDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Talent pool */}
      <Route
        path="/talent"
        element={
          <ProtectedRoute>
            <TalentPage />
          </ProtectedRoute>
        }
      />
      
      {/* Candidate detail */}
      <Route
        path="/talent/:id"
        element={
          <ProtectedRoute>
            <CandidateDetailPage />
          </ProtectedRoute>
        }
      />
      
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/grants"
        element={
          <ProtectedRoute>
            <AdminGrantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/challenges"
        element={
          <ProtectedRoute>
            <AdminChallengesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/mentors"
        element={
          <ProtectedRoute>
            <AdminMentorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/spotlight"
        element={
          <ProtectedRoute>
            <AdminSpotlightPage />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}

export default App;
