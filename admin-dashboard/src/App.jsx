import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/supabase.js';
import Auth from '../../citizen-portal/src/components/Auth.jsx';
import AdminMap from './components/AdminMap.jsx';
import Analytics from './components/Analytics.jsx';

function App() {
 const [session, setSession] = useState(null);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'analytics'

  useEffect(() => {
    console.log("Admin App: useEffect for session running");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Admin App: got session", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Admin App: onAuthStateChange triggered", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (session) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .then(({ data, error }) => {
          if (!error && data.length > 0) {
            setIsAdmin(data[0].role === 'admin' || data[0].role === 'staff');
          }
        });
    }
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="mb-4">Please sign in with an admin account to access the dashboard.</p>
          <Auth />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-4">You do not have permission to access the admin dashboard.</p>
          <button
            onClick={handleSignOut}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-90">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'map'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'analytics'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeView === 'map' ? <AdminMap /> : <Analytics />}
      </main>
    </div>
  );
}

export default App;
