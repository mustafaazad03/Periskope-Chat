import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export async function signUp(email: string, password: string, fullName: string = '') {
  console.log('Starting signup process for:', email);
  
  // First create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
      data: {
        full_name: fullName,
      }
    }
  })
  
  if (data?.user && !error) {
    console.log('Auth user created, now creating profile for:', data.user.id);
    
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return { data, error: profileError }
    }
    
    console.log('User profile created successfully:', userData);
  } else if (error) {
    console.error('Error during signup:', error);
  }
  
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export function getCurrentUser() {
  return supabase.auth.getUser()
}