// Simple monitoring script to check system health
import { supabase } from './shared/supabase.js'

async function checkHealth() {
  const checks = {
    database: false,
    storage: false,
    auth: false,
    realtime: false
  }

  // Check database
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('count')
      .limit(1)
    checks.database = !error
  } catch (e) {
    console.error('Database check failed:', e)
  }

  // Check storage
  try {
    const { data, error } = await supabase.storage
      .from('report-images')
      .list('', { limit: 1 })
    checks.storage = !error
  } catch (e) {
    console.error('Storage check failed:', e)
  }

  // Check auth
  try {
    const { data, error } = await supabase.auth.getSession()
    checks.auth = !error
  } catch (e) {
    console.error('Auth check failed:', e)
  }

  console.log('Health Check Results:', checks)
  return checks
}

// Run health check
checkHealth()