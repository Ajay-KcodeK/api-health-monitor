import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { RegisterRequest } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client side validation before hitting API
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await registerApi(form);
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  document.title = 'Register — API Health Monitor';
}, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔍</div>
          <h1 className="text-3xl font-bold text-white">API Health Monitor</h1>
          <p className="text-gray-400 mt-2">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Get started</h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400
                            rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white
                           rounded-lg px-4 py-3 text-sm placeholder-gray-500
                           focus:outline-none focus:border-blue-500 focus:ring-1
                           focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
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
                placeholder="Min. 6 characters"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          {/* Link to login */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;