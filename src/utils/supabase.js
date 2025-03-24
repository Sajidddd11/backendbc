const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// Create a singleton Supabase client for better connection management in serverless
let supabase = null;

// Get or create a Supabase client instance
const getSupabase = () => {
  if (!supabase) {
    // Initialize client with connection pooling options
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Don't persist auth state in serverless
      },
      // Using default connection pool settings
      // Supabase JS client handles connection pooling internally
    });
  }
  return supabase;
};

module.exports = getSupabase(); // Export the client instance 