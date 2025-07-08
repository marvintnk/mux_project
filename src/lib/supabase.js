// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = "https://bjfycqrfhndvntidmrgs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZnljcXJmaG5kdm50aWRtcmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTIyNTMsImV4cCI6MjA2NjMyODI1M30.GqDQWyMD21plSfeHVXogdOvi_r_g8yIcqyWfhaPjrx0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          location: userData.location,
          role: userData.role || 'student'
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Reset password
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },

  // Update user metadata
  async updateUser(userData) {
    const { data, error } = await supabase.auth.updateUser({
      data: userData
    });
    if (error) throw error;
    return data;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Storage helper functions
export const storage = {
  // Upload file to storage bucket
  async uploadFile(bucket, path, file, options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options.upsert || false,
        ...options
      });

    if (error) throw error;
    return data;
  },

  // Get public URL for a file
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Delete file from storage
  async deleteFile(bucket, paths) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(Array.isArray(paths) ? paths : [paths]);

    if (error) throw error;
    return data;
  },

  // List files in a bucket
  async listFiles(bucket, path = '', options = {}) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: options.limit || 100,
        offset: options.offset || 0,
        sortBy: options.sortBy || { column: 'name', order: 'asc' }
      });

    if (error) throw error;
    return data;
  },

  // Download file
  async downloadFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return data;
  }
};

// Database helper functions
export const db = {
  // Generic query builder
  from(table) {
    return supabase.from(table);
  },

  // Execute RPC (Remote Procedure Call)
  async rpc(functionName, params = {}) {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) throw error;
    return data;
  }
};

// Real-time helper functions
export const realtime = {
  // Subscribe to table changes
  subscribe(table, callback, filter = {}) {
    const channel = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table,
          ...filter
        }, 
        callback
      )
      .subscribe();

    return channel;
  },

  // Subscribe to specific events
  subscribeToInserts(table, callback, filter = {}) {
    return this.subscribe(table, callback, { event: 'INSERT', ...filter });
  },

  subscribeToUpdates(table, callback, filter = {}) {
    return this.subscribe(table, callback, { event: 'UPDATE', ...filter });
  },

  subscribeToDeletes(table, callback, filter = {}) {
    return this.subscribe(table, callback, { event: 'DELETE', ...filter });
  },

  // Unsubscribe from channel
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },

  // Create a presence channel for real-time user presence
  createPresenceChannel(channelName) {
    return supabase.channel(channelName, {
      config: {
        presence: {
          key: 'user_presence'
        }
      }
    });
  }
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  async isAuthenticated() {
    const session = await auth.getCurrentSession();
    return !!session;
  },

  // Get user role
  async getUserRole() {
    const user = await auth.getCurrentUser();
    return user?.user_metadata?.role || 'student';
  },

  // Check if email is university email
  isUniversityEmail(email) {
    const universityDomains = [
      'uni-magdeburg.de',
      'ovgu.de',
      'student.ovgu.de',
      'h2.de',
      'hs-magdeburg.de'
    ];
    
    return universityDomains.some(domain => email.endsWith(domain));
  },

  // Format error messages
  formatError(error) {
    const errorMessages = {
      'Invalid login credentials': 'Ungültige Anmeldedaten',
      'Email not confirmed': 'E-Mail nicht bestätigt',
      'User already registered': 'Benutzer bereits registriert',
      'Password should be at least 6 characters': 'Passwort sollte mindestens 6 Zeichen haben'
    };

    return errorMessages[error.message] || error.message;
  },

  // Generate unique filename for uploads
  generateFileName(originalName, userId) {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `${userId}_${timestamp}.${extension}`;
  },

  // Validate file type and size
  validateFile(file, options = {}) {
    const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('Datei ist zu groß');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Dateityp nicht unterstützt');
    }

    return true;
  }
};

export default supabase;