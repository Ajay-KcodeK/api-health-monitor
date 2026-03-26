import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { LoginRequest } from '../types';

const LoginPage: React.FC = () => {
  // useNavigate = programmatic navigation (redirect after login)
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state — tracks what user is typing
  const [form, setForm] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Handles input changes for ANY field
  // e.target.name matches the field name in our form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload on form submit
    setLoading(true);
    setError('');

    try {
      const data = await loginApi(form);
      login(data);             // save token to context + localStorage
      navigate('/dashboard');  // redirect to dashboard
    } catch (err: any) {
      // Extract error message from API response
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Update browser tab title for each page
useEffect(() => {
  document.title = 'Login — API Health Monitor';
}, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔍</div>
          <h1 className="text-3xl font-bold text-white">API Health Monitor</h1>
          <p className="text-gray-400 mt-2">Sign in to your dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400
                            rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"         // must match LoginRequest field name
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white
                           rounded-lg px-4 py-3 text-sm placeholder-gray-500
                           focus:outline-none focus:border-blue-500 focus:ring-1
                           focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white
                           rounded-lg px-4 py-3 text-sm placeholder-gray-500
                           focus:outline-none focus:border-blue-500 focus:ring-1
                           focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800
                         disabled:cursor-not-allowed text-white font-semibold
                         rounded-lg px-4 py-3 text-sm transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          {/* Link to register */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;