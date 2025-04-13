import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Direct connection for persistent connections
export const supabaseDirectConnection = createClient<Database>(
  'postgresql://postgres:imran@1786@db.hhunwvqttgkibxxsxtub.supabase.co:5432/postgres',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public'
    }
  }
);

// Transaction pooler for serverless functions
export const supabasePooler = createClient<Database>(
  'postgresql://postgres.hhunwvqttgkibxxsxtub:imran@1786@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public'
    }
  }
);
