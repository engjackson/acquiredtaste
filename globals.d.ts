import { createClient } from '@supabase/supabase-js';

// --- 1. SUPABASE TYPES ---
interface SupabaseGlobal {
  createClient: typeof createClient;
}

// --- 2. MIXPANEL TYPES (Minimal definitions for methods used) ---
interface MixpanelPeople {
    set: (properties: Record<string, any>) => void;
}
interface Mixpanel {
    track: (eventName: string, properties: Record<string, any>) => void;
    identify: (userId: string) => void;
    people: MixpanelPeople;
}

// --- 3. GOOGLE ANALYTICS (GA4) TYPES ---
// The universal function used to send data
type GTagFunction = (
    command: 'config' | 'event' | string, 
    targetId: string | string, 
    params?: Record<string, any>
) => void;

// --- 4. META PIXEL (FBQ) TYPES ---
// The function used for tracking Facebook/Meta Pixel events
type FBQFunction = (
    command: 'track' | 'init' | 'set' | string, 
    eventName: string, 
    params?: Record<string, any>
) => void;


// --- GLOBAL WINDOW AUGMENTATION ---
declare global {
  interface Window {
    supabase?: SupabaseGlobal;
    mixpanel?: Mixpanel;
    gtag?: GTagFunction;
    fbq?: FBQFunction;
  }
}

// Ensures TypeScript treats this as a module augmentation file
export {};