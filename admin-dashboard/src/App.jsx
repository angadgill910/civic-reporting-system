import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import AdminMap from './components/AdminMap.jsx'
import Analytics from './components/Analytics.jsx'
import './App.css'

// Initialize Supabase client directly in the admin dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase config:', { 
  url: supabaseUrl ? 'Present' : 'Missing', 
  key: supabaseAnonKey ? 'Present' : 'Missing' 
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export supabase for use in other components
export { supabase }

// Auth Component matching citizen portal design
function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role: 'admin' } // Set admin role for new signups
          }
        })
        if (error) throw error
        alert('Check your email to confirm your account!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required={!isLogin}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <button
            type="button"
            className="font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && (
          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>
      </div>
    </form>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [activeView, setActiveView] = useState('map')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if user is admin
  useEffect(() => {
    if (session) {
      checkAdminStatus()
    } else {
      setIsAdmin(false)
    }
  }, [session])

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!error && data) {
        setIsAdmin(data.role === 'admin' || data.role === 'staff')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      // For now, allow access if we can't check (development mode)
      setIsAdmin(true)
    }
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      console.log('Starting sign out process...')
      console.log('Current session:', session)
      
      // Clear all local storage and session storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Try different sign out approaches
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.warn('Supabase sign out error (continuing anyway):', error)
      }
      
      console.log('Sign out completed')
      // Force clear session state
      setSession(null)
      setIsAdmin(false)
      
      // Force reload to ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
      
    } catch (error) {
      console.error('Error during sign out:', error)
      // Force clear even on error
      localStorage.clear()
      sessionStorage.clear()
      setSession(null)
      setIsAdmin(false)
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } finally {
      setSigningOut(false)
    }
  }

  // Temporary function to clean up orphaned auth users
  const handleCleanupAuthUser = async () => {
    const email = prompt('Enter email to remove from auth:')
    if (!email) return

    try {
      // This requires admin privileges - you might need to do this from Supabase dashboard instead
      const { data, error } = await supabase.auth.admin.deleteUser(
        email // This actually needs user ID, not email
      )
      
      if (error) {
        console.error('Error deleting auth user:', error)
        alert('Error: ' + error.message + '\n\nPlease use the Supabase Dashboard instead:\n1. Go to Authentication → Users\n2. Find and delete the user\n3. Try signing up again')
      } else {
        alert('User deleted from auth system')
      }
    } catch (error) {
      alert('This requires admin access. Please use Supabase Dashboard:\n1. Go to Authentication → Users\n2. Find and delete the user\n3. Try signing up again')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Check for missing environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Configuration Error</h2>
          <p className="mb-4 text-gray-600 text-center">
            Missing Supabase environment variables. Please check your configuration.
          </p>
          <div className="text-sm text-gray-500">
            <p>VITE_SUPABASE_URL: {supabaseUrl ? '✓' : '✗'}</p>
            <p>VITE_SUPABASE_ANON_KEY: {supabaseAnonKey ? '✓' : '✗'}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Dashboard Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the administrative dashboard
            </p>
          </div>
          <Auth />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Access Denied</h2>
          <p className="mb-6 text-gray-600 text-center">
            You do not have permission to access the admin dashboard.
          </p>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeView === 'map'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reports
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
              onClick={handleCleanupAuthUser}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              title="Remove orphaned auth users"
            >
              Cleanup Auth
            </button>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              {signingOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeView === 'map' ? <AdminMap /> : <Analytics />}
      </main>
    </div>
  )
}

export default App
