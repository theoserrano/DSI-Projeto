
import { supabase } from './supabaseConfig';

export interface Profile {
  id?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  [key: string]: any;
}

export async function createProfile(profile: Profile) {
  const { data, error } = await supabase.from('profiles').insert([profile]);
  if (error) throw error;
  return data;
}

export async function getProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function deleteProfile(id: string) {
  const { data, error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  return data;
}
