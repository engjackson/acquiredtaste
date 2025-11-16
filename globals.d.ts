import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 1. Define the structure of the global 'supabase' object
interface SupabaseGlobal {
  // We specify that 'createClient' has the same type as the one imported from the package
  createClient: typeof createClient;
}

// 2. Augment the global Window interface to include the new property
declare global {
  interface Window {
    // The property 'supabase' is optional (may not be loaded yet) and should use the type defined above.
    supabase?: SupabaseGlobal;
  }
}

// This export is necessary to ensure TypeScript treats this as a module augmentation file
export {};