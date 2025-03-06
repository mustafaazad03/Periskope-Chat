import { supabase } from './supabase';

// Store for online users
const onlineUsers = new Set<string>();

// Function to track user presence
export function trackPresence(userId: string) {
  console.log('Tracking presence for user:', userId);
  
  // Add user to online users
  onlineUsers.add(userId);
  
  // Set up presence channel
  const channel = supabase.channel('online');
  
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      console.log('Presence state updated:', state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences);
      newPresences.forEach(presence => {
        if (presence.user_id) onlineUsers.add(presence.user_id);
      });
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences);
      leftPresences.forEach(presence => {
        if (presence.user_id) onlineUsers.delete(presence.user_id);
      });
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });
    
  // Return the channel for cleanup
  return channel;
}

// Helper to check if a user is online
export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

// Function to get all online users
export function getOnlineUsers(): string[] {
  return Array.from(onlineUsers);
}