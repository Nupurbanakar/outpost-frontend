import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components';

// Pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerifyPage from './pages/VerifyPage';
import OnboardingPage from './pages/OnboardingPageMultiStep';
import DiscoverPage from './pages/DiscoverPage';
import GrantsPage from './pages/GrantsPage';

function App() {
  return (
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
      
      {/* Placeholder protected routes for future implementation */}
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <div className="p-8">Opportunities page (coming soon)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentors"
        element={
          <ProtectedRoute>
            <div className="p-8">Mentors page (coming soon)</div>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all - redirect to discover for authenticated users, login otherwise */}
      <Route path="*" element={<Navigate to="/discover" replace />} />
    </Routes>
  );
}

export default App;
