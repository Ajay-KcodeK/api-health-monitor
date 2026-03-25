import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-400 mb-6">
          Dashboard coming next...
        </p>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white
                     px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;