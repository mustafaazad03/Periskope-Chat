import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export async function signUp(email: string, password: string, fullName: string = '', phone: string = '') {
  try {
    // First create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: fullName || email.split('@')[0],
          phone: phone || '',
        }
      }
    });
    console.log('Sign-up response:', JSON.stringify({ data, error }, null, 2));
    
    if (error) throw error;
    console.log('data', data);
    if (!data.user) {
      throw new Error("User creation failed with no error");
    }
    
    // Return success
    return { data, error: null };
    
  } catch (error) {
    console.error("Signup error:", error);
    return { data: null, error };
  }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  return await supabase.auth.getUser()
}

export function getCurrentSession() {
  return supabase.auth.getSession()
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({ password: newPassword })
}