import { supabase } from './supabase';

// Store for online users - initialize as empty
const onlineUsers = new Set<string>();

// Function to track user presence
export function trackPresence(userId: string) {
  // Add user to online users
  onlineUsers.add(userId);
  
  // Set up presence channel with a unique name that includes the user ID
  const channel = supabase.channel(`presence:${userId}`);
  
  channel
    .on('presence', { event: 'sync' }, () => {
      // Update our local state based on the complete presence state
      const state = channel.presenceState();
      
      // Clear current online users and repopulate
      onlineUsers.clear();
      
      // Extract all online user IDs from the presence state
      Object.values(state).forEach(presences => {
        (presences as any[]).forEach(presence => {
          if (presence.user_id) onlineUsers.add(presence.user_id);
        });
      });
      
      console.log('Presence state synced, online users:', Array.from(onlineUsers));
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
        // Track this user's presence
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
        
        // Set up a heartbeat to keep the presence alive
        const heartbeatInterval = setInterval(async () => {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
        }, 30000); // Every 30 seconds
        
        // Store the interval ID in the channel for cleanup
        (channel as any).heartbeatInterval = heartbeatInterval;
      }
    });
    
  // Return the channel for cleanup
  return {
    channel,
    cleanup: () => {
      // Clear the heartbeat interval if it exists
      if ((channel as any).heartbeatInterval) {
        clearInterval((channel as any).heartbeatInterval);
      }
      
      // Remove the user from the online users set
      onlineUsers.delete(userId);
      
      // Remove the channel
      supabase.removeChannel(channel);
    }
  };
}

// Helper to check if a user is online
export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

// Function to get all online users
export function getOnlineUsers(): string[] {
  return Array.from(onlineUsers);
}

// Subscribe to presence changes for multiple users
export function subscribeToUsersPresence(
  userIds: string[], 
  onStatusChange: (userId: string, isOnline: boolean) => void
) {
  const channels = userIds.map(userId => {
    const channel = supabase.channel(`presence:${userId}`);
    
    channel
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        newPresences.forEach(presence => {
          if (presence.user_id === userId) {
            onStatusChange(userId, true);
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        leftPresences.forEach(presence => {
          if (presence.user_id === userId) {
            onStatusChange(userId, false);
          }
        });
      })
      .subscribe();
    
    return channel;
  });
  
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
  };
}