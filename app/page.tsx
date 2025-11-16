'use client';
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Globe, Goal, Utensils } from "lucide-react";

// The global type declarations (for window.supabase, window.mixpanel, etc.) 
// are managed externally (e.g., in a types/global.d.ts file) to avoid the build error.

// --- Supabase Client Initialization Hook ---
const useSupabaseClient = (url: string, anonKey: string) => {
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the client is already available (e.g., loaded by another component)
    if (window.supabase) {
      setSupabaseClient(window.supabase.createClient(url, anonKey));
      setLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.2/dist/umd/supabase.min.js';
    script.async = true;

    const onLoad = () => {
      if (window.supabase && window.supabase.createClient) {
        setSupabaseClient(window.supabase.createClient(url, anonKey));
        setLoading(false);
      } else {
        setError("Supabase library loaded, but client creation failed.");
        setLoading(false);
      }
    };

    const onError = () => {
      setError("Failed to load Supabase library from CDN.");
      setLoading(false);
    };

    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [url, anonKey]);

  return { supabaseClient, loading, error };
};

// --- ANALYTICS TRACKING UTILITY (Combined Logic for Mixpanel, GA4, Meta Pixel) ---
// This function is called only after a successful database insertion.
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  console.log(`[Analytics] Tracking event: ${eventName}`, properties);

  // 1. Mixpanel Tracking (Identify and Track)
  // window.mixpanel is safe to access because it's declared globally in another file.
  if (typeof window.mixpanel !== 'undefined' && typeof window.mixpanel.track === 'function') {
    // Identify the user and set properties
    window.mixpanel.identify(properties.email);
    window.mixpanel.people.set({
      $email: properties.email,
      $first_name: properties.first_name,
      'Waitlist Status': 'Signed Up',
    });
    // Track the conversion event
    window.mixpanel.track(eventName, properties);
  } else {
    console.warn("Mixpanel object (window.mixpanel) not found. Event not tracked.");
  }

  // 2. Google Analytics Tracking (GA4)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName.toLowerCase(), {
      'event_category': 'Waitlist', 
      'event_label': properties.email,
      'send_to': 'G-BW34P93HJS' // Target GA4 Property ID
    });
  } else {
    console.warn("Google Analytics object (window.gtag) not found. Event not tracked.");
  }

  // 3. Meta Pixel Tracking
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration', {
        content_name: 'Waitlist Signup',
        status: 'success',
        email: properties.email
    });
  } else {
    console.warn("Meta Pixel object (window.fbq) not found. Event not tracked.");
  }
};


// --- COLOR PALETTE DEFINITION ---
const PRIMARY_COLOR = '#FF7A00'; // Orange
const PRIMARY_HOVER_COLOR = '#E56F00'; // Darker Orange
const ACCENT_COLOR = '#007C91'; // Teal
const BG_COLOR = '#F9F4EC'; // Off-White/Cream
const TEXT_COLOR = '#2E2E2E'; // Dark Charcoal
const WHITE_RING = '#FFFFFF'; // White for centerpiece

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://yiccjijuhnyjmfihawcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpY2NqaWp1aG55am1maWhhd2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTEwODMsImV4cCI6MjA3NzQ4NzA4M30.OqwVK_tgSq7qPRc-VqziSh9JIgOg6M_xmB2xExUVgd8';
const WAITLIST_TABLE_NAME = 'signups'; 

// --- Image Asset IDs from uploaded files ---
const ASSET_IDS = {
  logo: "uploaded:image_c1f20d.jpg-916d6719-3b3f-44a6-bbe0-a7504b3c08b2",
  screenshotDashboard: "uploaded:image_9030c9.png-de660518-1c0e-41b9-ad53-54539fb7636e",
  screenshotExplore: "uploaded:image_90a928.png-70d4a987-bd0e-4fe6-9b2e-e28649f47acb",
  screenshotPassport: "uploaded:image_9120e9.png-83b7dc7a-1182-40df-8de9-751f2bde57f4",
};

export default function App() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const { supabaseClient, loading: isLoadingSupabase, error: supabaseLoadError } = useSupabaseClient(
    supabaseUrl,
    supabaseAnonKey
  );
  
  // Set submission error if Supabase fails to load initially
  useEffect(() => {
    if (supabaseLoadError) {
      setSubmissionError(supabaseLoadError);
    }
  }, [supabaseLoadError]);

  // --- SEO and Title Management ---
  useEffect(() => {
    document.title = "Acquired Taste | The Cultural Food Passport App";
    const description = "Acquired Taste: The Gamified Cultural Food Passport. Log meals (cooked or dining out), discover global holidays, and get taste-based recommendations to explore new cuisines and earn badges.";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    
    if (!meta) {
      meta = document.createElement('meta') as HTMLMetaElement;
      meta.name = 'description'; 
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  // --- SUBMISSION HANDLER (Saves data to Supabase and tracks analytics) ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');

    if (!email || !email.includes("@") || !firstName) return;
    
    if (isLoadingSupabase || !supabaseClient) {
      setSubmissionError("Supabase is still connecting or failed to load. Please wait a moment.");
      return;
    }
    
    // Capture data needed for DB and Analytics before the async call
    const submissionData = {
      first_name: firstName, 
      email: email, 
      platform: 'Landing Page'
    };
    
    console.log("Attempting to insert:", submissionData);

    try {
      const { data, error } = await supabaseClient
        .from(WAITLIST_TABLE_NAME)
        .insert([
          {
            first_name: submissionData.first_name,
            email: submissionData.email,
          }
        ]);

      if (error) {
        // Log the error object for server-side debugging
        console.error("Supabase API Insertion Error:", error);
        // Specifically check for duplicate email error (usually HTTP 409 or RLS denial)
        const errorMessage = error.message.includes('duplicate key value') ? 
                             "You're already on the waitlist! Thanks for your interest." : 
                             error.message;
        throw new Error(errorMessage);
      }

      // --- ANALYTICS FIX ---
      // This is the correct placement: Fires only after successful database insert.
      trackEvent('Waitlist_Signup_Success', submissionData);

      // Success state update
      setSubmitted(true);
      setEmail("");
      setFirstName("");
      // --- END ANALYTICS FIX ---

    } catch (error: any) {
      console.error("Client Error during Supabase call:", error);
      // This is the error the user sees in the UI
      setSubmissionError(`Submission failed. This is often caused by security (RLS) rules or email already being registered. Error: ${error.message || 'Unknown error'}.`);
    }
  }, [firstName, email, isLoadingSupabase, supabaseClient]);


  return (
    <main 
      className={`min-h-screen flex flex-col items-center justify-between font-sans pb-20`}
      style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}
    >

    {/* ===================================================================
      SECTION 1: HERO & SIGN-UP
    =================================================================== */}
    <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center w-full max-w-7xl flex-grow">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      
        {/* LOGO IMAGE */}
        <img
          src="/img/acquiredtasteuni.png"
          alt="Acquired Taste Logo"
          className="max-w-xs md:max-w-md mx-auto mb-6 h-auto"
        />

        {/* App Name - H1 */}
        <h1
          className={`text-4xl md:text-6xl font-black leading-tight mb-4 tracking-widest uppercase`}
          style={{ color: TEXT_COLOR }}
        >
          ACQUIRED Taste
        </h1>
        
        {/* Tagline - H2 */}
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: TEXT_COLOR }}
        >
          Taste the World.
          <span style={{ color: PRIMARY_COLOR }}> Learn the Culture. </span>
          <span style={{ color: ACCENT_COLOR }}>Collect the Memory.</span>
        </h2>
        
        {/* Sub-Headline */}
        <p className={`mt-4 text-xl max-w-4xl mx-auto`} style={{ color: TEXT_COLOR }}>
        The <strong>Gamified Cultural Passport</strong> that transforms every dish into a global discovery, a personal story, and a powerful memory.
        </p>
        
        {/* Explanatory Paragraph */}
        <p
          className={`mt-6 max-w-3xl mx-auto text-lg border-t border-b py-4 px-4`}
          style={{ color: TEXT_COLOR, borderColor: PRIMARY_COLOR + '30' }}
        >
        Acquired Taste is your new best friend for your food adventure! Log your entire food journey, whether you're cooking a meal at home or dining out. We're here to help you get culturally fluent, one delicious bite at a time. Find out about upcoming global holidays and traditions, and discover the awesome dishes served to celebrate them. Food is the universal party starter! Break out of your comfort zone, try new cuisines, and turn every single meal into a fun, rewarding, educational quest. In the long run, the app will use your preferred tastes, ingredients, and dining history to recommend new food adventures you've have yet to experience.
        </p>
          {/* Waitlist Count / Social Proof */}
        <p
          className="mt-8 text-sm font-semibold uppercase tracking-widest"
          style={{ color: PRIMARY_COLOR }}
        >
          Are you a foodie ready to explore the world?
        </p>
      </motion.div>

        {/* Form Area */}
        <div className="mt-8 w-full max-w-xl">
          {!submitted ? (
            <>
              {/* Submission Error Display */}
              {submissionError && (
                <p className="mb-4 text-sm font-medium text-red-600 p-3 bg-red-100 rounded-xl border border-red-300 shadow-md">
                  **Error:** {submissionError}
                </p>
              )}
              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-800`}
                  style={{ outlineColor: PRIMARY_COLOR, outlineOffset: '2px' }}
                  required
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-800`}
                  style={{ outlineColor: PRIMARY_COLOR, outlineOffset: '2px' }}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-white rounded-xl transition font-medium text-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = PRIMARY_HOVER_COLOR}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                  disabled={isLoadingSupabase || !!supabaseLoadError}
                >
                  {isLoadingSupabase ? "Connecting..." : "Reserve My Spot"}
                </button>
              </motion.form>
              <p className="text-xs text-gray-600 mt-2 text-center">No spam. Just an exclusive beta invite and occasional feedback requests to help us grow the app.</p>
            </>
          ) : (
          <motion.div
            className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-xl w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-10 h-10 mb-2 text-green-600" />
            <p className={`font-medium text-lg`} style={{ color: TEXT_COLOR }}>
              You're on the list! We’ll be in touch soon 🍽️
            </p>
          </motion.div>
          )}
        </div>
      </section>

    {/* ===================================================================
      APP SCREENSHOT GALLERY (RESPONSIVE)
    =================================================================== */}
    <div className="w-full max-w-6xl mx-auto my-12 px-6">
      
      {/* -----------------------------------------------------------------
      MOBILE SCREENSHOT GALLERY (Vertical Stack)
      Visible on mobile (< md), hidden on desktop (>= md)
      ----------------------------------------------------------------- */}
      <div className="flex flex-col items-center space-y-6 pt-12 md:hidden">
      
        {/* Mobile Screenshot 1: Dashboard */}
        <motion.img
          src="/img/screenshot-dashboard.png"
          alt="Acquired Taste Dashboard showing home dashboard"
          className="w-64 h-auto rounded-3xl shadow-xl border-4"
          style={{ borderColor: ACCENT_COLOR }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        
        {/* Mobile Screenshot 2: Swipe/Explore (Center/Hero) */}
        <motion.img
          src="/img/screenshot-explore.png"
          alt="Acquired Taste Explore Swipe card for new dishes"
          className="w-64 h-auto rounded-3xl shadow-xl border-4"
          style={{ borderColor: WHITE_RING, outline: `4px solid ${PRIMARY_COLOR}` }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Mobile Screenshot 3: Feasts/Holidays (Passport) */}
        <motion.img
          src="/img/screenshot-passport.png"
          alt="Acquired Taste Cultural Feasts list"
          className="w-64 h-auto rounded-3xl shadow-xl border-4"
          style={{ borderColor: ACCENT_COLOR }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>


      {/* -----------------------------------------------------------------
      DESKTOP SCREENSHOT GALLERY 
      ----------------------------------------------------------------- */}
      <div className="hidden md:flex justify-center items-center py-12 space-x-8">
      
        {/* Dashboard Screenshot */}
        <motion.img
          src="/img/screenshot-dashboard.png"
          alt="Acquired Taste Dashboard showing home dashboard"
          // Simple sizing and transition effect
          className="w-64 h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.05]"
          style={{ borderColor: ACCENT_COLOR, borderWidth: '4px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        
        {/* Explore Screenshot */}
        <motion.img
          src="/img/screenshot-explore.png"
          alt="Acquired Taste Explore Swipe card for new dishes"
          // Simple sizing and transition effect, border to highlight focus
          className="w-64 h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.05]"
          style={{ borderColor: WHITE_RING, borderWidth: '8px', outline: `4px solid ${PRIMARY_COLOR}` }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Passport Screenshot */}
        <motion.img
          src="/img/screenshot-passport.png"
          alt="Acquired Taste Cultural Feasts list"
          // Simple sizing and transition effect
          className="w-64 h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.05]"
          style={{ borderColor: ACCENT_COLOR, borderWidth: '4px' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </div>
    </div>
    
    {/* ===================================================================
      SECTION 2: CORE VALUE PROPOSITION (The Benefits)
    =================================================================== */}
    <section
      className="w-full py-20 shadow-inner"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <h2 className="text-4xl font-bold text-center mb-12 md:col-span-3" style={{ color: TEXT_COLOR }}>
          <strong>T</strong>he <strong>A</strong>dventure, <strong>S</strong>tory, <strong>T</strong>radition, & <strong>E</strong>xperience
        </h2>
        
        <motion.div
          className="p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4"
          style={{ backgroundColor: BG_COLOR, borderColor: PRIMARY_COLOR }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Globe className="w-10 h-10 mb-3" style={{ color: PRIMARY_COLOR }} />
          <h3 className="text-2xl font-semibold" style={{ color: TEXT_COLOR }}>Stamp Your Digital Passport</h3>
          <p className="mt-2 text-gray-600">
          Every dish you log earns you a country stamp, turning your food journey into a rewarding game of discovery and achievement. Track your world journey, one meal at a time.
          </p>
        </motion.div>

        <motion.div
          className="p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4"
          style={{ backgroundColor: BG_COLOR, borderColor: ACCENT_COLOR }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Goal className="w-10 h-10 mb-3" style={{ color: ACCENT_COLOR }} />
          <h3 className="text-2xl font-semibold" style={{ color: TEXT_COLOR }}>Conquer Monthly Quests and Badges</h3>
          <p className="mt-2 text-gray-600">
          Break out of your comfort zone with fun monthly challenges like "experience a noodle from any country in Asia" or "Bake any type of bread from scratch at home." Complete the quest goals and earn exclusive monthly Bronze, Silver, and Gold badges.
          </p>
        </motion.div>

        {/* Card 3: Discovery (Cultural Feasts) */}
        <motion.div
          className="p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4"
          style={{ backgroundColor: BG_COLOR, borderColor: PRIMARY_COLOR }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Utensils className="w-10 h-10 mb-3" style={{ color: PRIMARY_COLOR }} />
          <h3 className="text-2xl font-semibold" style={{ color: TEXT_COLOR }}>A Guide to Cultural Feasts</h3>
          <p className="mt-2 text-gray-600">
          Explore global holidays and festivals with our cultural guide. Learn the story, significance, and traditional dishes of events like Day of the Dead and Hanukkah to inspire your next meal.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ===================================================================
      SECTION 3: CLOSING CTA
    =================================================================== */}
    <section className="w-full py-16 px-6 text-center">
      <h2 className="text-3xl font-bold" style={{ color: TEXT_COLOR }}>
        The World is Waiting. Are You Ready to Taste It?
      </h2>
      <p className="mt-3 text-lg max-w-3xl mx-auto text-gray-700">
        Don't let another amazing meal fade away. Join the movement of cultural explorers who document their journey.
      </p>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Scroll to top to sign up
        className="mt-6 px-10 py-4 text-white rounded-xl transition font-bold text-xl shadow-lg hover:shadow-xl"
        style={{ backgroundColor: PRIMARY_COLOR }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = PRIMARY_HOVER_COLOR}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
      >
        Get on the waitlist now!
      </button>
    </section>

    {/* Footer */}
    <footer
      className="w-full py-8 text-gray-200"
      style={{ backgroundColor: TEXT_COLOR }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center text-sm space-y-2">
        <p>&copy; {new Date().getFullYear()} Acquired Taste. Connecting the world through food.</p>
        <p>
          Questions or feedback? Email us: 
          <a
            href="mailto:acquired.app@gmail.com"
            className="text-white underline hover:text-red-300 transition"
          >
            acquiredtaste.app@gmail.com
          </a>
        </p>
      </div>
    </footer>

    </main>
  );
}