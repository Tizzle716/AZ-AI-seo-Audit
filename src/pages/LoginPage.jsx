import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginPage({ onNavigate }) {
  const { login, register, forgotPassword, isLoading, error } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);

  // Get returnTo parameter from URL
  const getReturnTo = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('returnTo') || 'dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        // Navigate to returnTo destination or dashboard
        const destination = getReturnTo();
        onNavigate(destination);
      }
    } else if (mode === 'register') {
      const res = await register(email, password, name);
      if (res.success) {
        // Navigate to returnTo destination or dashboard
        const destination = getReturnTo();
        onNavigate(destination);
      }
    } else if (mode === 'forgot') {
      const res = await forgotPassword(email);
      if (res.success) {
        setMessage('Check your email for reset instructions.');
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'register' && 'Create your account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} className="text-blue-600 hover:underline">Forgot password?</button>
              <div className="mt-2">
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-blue-600 hover:underline">Sign up</button>
              </div>
            </>
          )}
          {mode === 'register' && (
            <>
              <div className="mt-2">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">Sign in</button>
              </div>
            </>
          )}
          {mode === 'forgot' && (
            <>
              <div className="mt-2">
                Remembered your password?{' '}
                <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">Sign in</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;