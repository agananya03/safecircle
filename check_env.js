require('dotenv').config();
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set');
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
console.log('Value of URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
