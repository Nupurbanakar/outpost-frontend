import { useState } from 'react';
import { useAuth } from '@/contexts';
import { grantsApi, challengesApi, mentorsApi, foundersApi } from '@/api';

export default function TestPage() {
  console.log('TestPage rendering...');
  
  const authContext = useAuth();
  console.log('Auth context:', authContext);
  
  const { user, isAuthenticated, isLoading, login, signup, logout, refreshUser } = authContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);

  const handleLogin = async () => {
    try {
      setError('');
      await login({ email, password });
      addResult('✅ Login successful');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
      addResult('❌ Login failed: ' + err.message);
    }
  };

  const handleSignup = async () => {
    try {
      setError('');
      await signup({
        email,
        password,
        founderName: 'Test User',
        startupName: 'Test Startup',
        city: 'Hyderabad',
      });
      addResult('✅ Signup successful');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
      addResult('❌ Signup failed: ' + err.message);
    }
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
      addResult('✅ User refreshed');
    } catch (err: any) {
      addResult('❌ Refresh failed: ' + err.message);
    }
  };

  const testPublicAPI = async () => {
    try {
      const grants = await grantsApi.getGrants({ page: 0, size: 5 });
      addResult(`✅ Grants API: ${grants.page.totalElements} total grants`);

      const challenges = await challengesApi.getChallenges({ page: 0, size: 5 });
      addResult(`✅ Challenges API: ${challenges.page.totalElements} total challenges`);

      const mentors = await mentorsApi.getMentors({ page: 0, size: 5 });
      addResult(`✅ Mentors API: ${mentors.page.totalElements} total mentors`);
    } catch (err: any) {
      addResult('❌ Public API failed: ' + err.message);
    }
  };

  const testProtectedAPI = async () => {
    try {
      const profile = await foundersApi.getMe();
      addResult(`✅ Protected API: Got profile for ${profile.founderName}`);
    } catch (err: any) {
      addResult('❌ Protected API failed: ' + err.message);
    }
  };

  const testTokenRefresh = async () => {
    // Manually expire the access token to test refresh
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      addResult('❌ No refresh token found');
      return;
    }
    
    // Set an expired token
    localStorage.setItem('accessToken', 'expired.token.here');
    
    try {
      const profile = await foundersApi.getMe();
      addResult('✅ Token refresh worked! Got profile: ' + profile.founderName);
    } catch (err: any) {
      addResult('❌ Token refresh failed: ' + err.message);
    }
  };

  const addResult = (message: string) => {
    setTestResults((prev) => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const clearResults = () => {
    setTestResults([]);
    setError('');
  };

  if (isLoading) {
    return <div className="p-8">Loading auth state...</div>;
  }

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-serif">Auth & API Test Page</h1>

        {/* Auth Status */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Auth Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
            </p>
            {user && (
              <>
                <p>
                  <strong>User:</strong> {user.founderName} ({user.email})
                </p>
                <p>
                  <strong>Startup:</strong> {user.startupName}
                </p>
                <p>
                  <strong>City:</strong> {user.city}
                </p>
              </>
            )}
            <div className="space-x-2 mt-4">
              <button onClick={handleRefreshUser} className="btn-secondary">
                Refresh User
              </button>
              {isAuthenticated && (
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Login/Signup Form */}
        {!isAuthenticated && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Login / Signup</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
              </div>
              {error && <p className="text-rose-600">{error}</p>}
              <div className="space-x-2">
                <button onClick={handleLogin} className="btn-primary">
                  Login
                </button>
                <button onClick={handleSignup} className="btn-secondary">
                  Signup (Test User)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Tests */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">API Tests</h2>
          <div className="space-x-2">
            <button onClick={testPublicAPI} className="btn-secondary">
              Test Public APIs
            </button>
            {isAuthenticated && (
              <>
                <button onClick={testProtectedAPI} className="btn-secondary">
                  Test Protected API
                </button>
                <button onClick={testTokenRefresh} className="btn-secondary">
                  Test Token Refresh
                </button>
              </>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Test Results</h2>
            <button onClick={clearResults} className="btn-secondary">
              Clear
            </button>
          </div>
          <div className="space-y-2 font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-muted">No tests run yet</p>
            ) : (
              testResults.map((result, idx) => (
                <div key={idx} className="border-b border-line pb-2">
                  <span className="text-muted-text">[{result.time}]</span> {result.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Token Info */}
        <div className="card mt-6">
          <h2 className="text-xl font-bold mb-4">Token Storage</h2>
          <div className="space-y-2 font-mono text-xs break-all">
            <p>
              <strong>Access Token:</strong>{' '}
              {localStorage.getItem('accessToken')?.substring(0, 50) || 'None'}...
            </p>
            <p>
              <strong>Refresh Token:</strong>{' '}
              {localStorage.getItem('refreshToken')?.substring(0, 50) || 'None'}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
