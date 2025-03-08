"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, getUser } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session and user
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Get user profile from database
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();
            
          if (!error && data) {
            setProfile(data);
          } else if (error && error.code !== 'PGRST116') { // Not "No rows returned"
            console.error("Error fetching user profile:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Handle auth events
          switch (event) {
            case 'SIGNED_IN':
              if (newSession?.user) {
                // Get user profile on sign in
                const { data, error } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", newSession.user.id)
                  .single();
                  
                if (!error && data) {
                  setProfile(data);
                } else {
                  // Create profile if it doesn't exist
                  await createUserProfile(newSession.user);
                }
                
                // Navigate to home page after sign-in
                router.push('/');
              }
              break;
              
            case 'SIGNED_OUT':
              setProfile(null);
              router.push('/login');
              break;
              
            case 'USER_UPDATED':
              // Refresh profile data
              if (newSession?.user) {
                const { data } = await supabase
                  .from("users")
                  .select("*")
                  .eq("id", newSession.user.id)
                  .single();
                  
                if (data) setProfile(data);
              }
              break;
              
            default:
              break;
          }
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Helper to create a user profile
  const createUserProfile = async (user: User) => {
    if (!user) return;
    
    try {
      // Create a new user profile record
      const { error } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      
      if (error) throw error;
      
      // Fetch the created profile
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return response;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    
    return response;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    
    // Update user metadata if name is included
    if (data.name) {
      await supabase.auth.updateUser({
        data: { name: data.name }
      });
    }
    
    // Update profile in database
    const { error } = await supabase
      .from("users")
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);
    
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    
    // Update local state
    setProfile({ ...profile, ...data });
  };
  
  // Add password reset functionality
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}