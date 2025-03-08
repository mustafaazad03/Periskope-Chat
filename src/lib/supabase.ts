import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get authenticated user
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to subscribe to realtime changes
export const subscribeToChannel = (channelName: string, callback: (payload: any) => void) => {
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};