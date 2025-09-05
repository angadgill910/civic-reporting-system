import React, { useState, useEffect } from 'react';
import { supabase } from '../../shared/supabase.js';
import Auth from './components/Auth.jsx';
import ReportForm from './components/ReportForm.jsx';
import ReportsList from './components/ReportsList.jsx';

function App() {
  const [session, setSession] = useState(null);
  const [activeView, setActiveView] = useState('reports'); // 'reports' or 'new-report'

  useEffect(() => {
    console.log("Citizen App: useEffect for session running");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Citizen App: got session", session);
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Citizen App: onAuthStateChange triggered", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

 if (!session) {
    return <Auth />;
 }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-90">Civic Reporter</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('reports')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'reports'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveView('new-report')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'new-report'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              New Report
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

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeView === 'new-report' ? <ReportForm /> : <ReportsList />}
        </div>
      </main>
    </div>
  );
}

export default App;
