import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fquuhzfdyjxcmzeopvcn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdXVoemZkeWp4Y216ZW9wdmNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTM2MzAyMSwiZXhwIjoyMDU0OTM5MDIxfQ.l3jv03EdL0gRauoHwN17BVAw0_sXXkHN7CBMPgKGyu8';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // Try to fetch some data to test connection
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Connected to Supabase', data });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to Supabase', error: error.message });
  }
}
