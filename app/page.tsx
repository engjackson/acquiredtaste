"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Globe, BookOpen, Map } from "lucide-react"; 
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !firstName) return;

    // Supabase logic
    const { error } = await supabase.from("signups").insert([
      { email, first_name: firstName },
    ]);


   if (error) {
        console.error("Signup error:", error.message);
        alert("Your culinary compass lost its signal! Please try again.");

        // ⭐ TRACK SUPABASE (SERVER-SIDE) FAILURE
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'form_supabase_fail', {
                'event_category': 'Error',
                'event_label': `Supabase Error: ${error.message.substring(0, 50)}`, // Log the error message
                'value': 0
            });
        }
        return;
    }

// ⭐ TRACK SUCCESS (GA and Mixpanel)
 if (typeof window.gtag === 'function') {
 window.gtag('event', 'lead_form_submit', {
 'event_category': 'Engagement',
 'event_label': 'Waitlist Signup',
 'value': 1 
 });

if (typeof window.mixpanel !== 'undefined') {
    window.mixpanel.track("Waitlist Signup Success", {
        'first_name': firstName,
        'platform': 'Web'
    });
}

    setSubmitted(true);
    setEmail("");
    setFirstName("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-orange-50 to-amber-100 text-gray-900">
      
      {/* ===================================================================
        SECTION 1: HERO & SIGN-UP
        ===================================================================
      */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center w-full max-w-7xl flex-grow"> 
    {/* Hype & Branding */}
    <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}

    > 
        
        {/* App Name - H1: Large, Extrabold, Distinct Color to stand out */}
        <h1 className="text-6xl md:text-8xl font-black text-amber-900 leading-tight mb-4 tracking-widest uppercase"> 
            ACQUIRED TASTE 
        </h1> 
        
        {/* Tagline - H2: Smaller font size to support the H1 */}
        <h2 className="text-3xl font-bold text-amber-800 mb-2"> 
            Taste the World.  
            <span className="text-amber-600"> Learn the Culture. </span> 
            <span className="text-amber-800">Collect the Memory.</span> 
        </h2> 
        
        {/* Sub-Headline (The Gamified Cultural Passport...) */}
        <p className="mt-4 text-xl max-w-4xl text-gray-700 mx-auto"> 
            The <strong>Gamified Cultural Passport</strong> that transforms every dish into a global discovery, a personal story, and a powerful memory. 
        </p> 
        
        {/* Explanatory Paragraph */}
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-800 border-t border-b border-amber-200 py-4 px-4"> 
            Acquired Taste is your new best friend for food adventure! We're here to help you get culturally fluent, one delicious bite at a time. Find out about upcoming global holidays and traditions, and discover the awesome dishes served to celebrate them. Food is the universal party starter! Break out of your comfort zone, try new cuisines, and turn every single meal into a fun, rewarding, educational quest. 
        </p>
            {/* Waitlist Count / Social Proof */}
            <p className="mt-8 text-sm font-semibold text-amber-700 uppercase tracking-widest">
                Are you a foodie ready to explore the world?
            </p>
        </motion.div>

        {/* Form Area - The max-w-md and mx-auto ensure it's centered and aligned */}
        <div className="mt-8 w-full max-w-xl">
            {!submitted ? (
            <motion.form
                onSubmit={handleSubmit}
                // FIX: Added mx-auto here to ensure form is perfectly centered
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
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
                    required
                />
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
                    required
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition font-medium text-lg flex-shrink-0"
                >
                    🚀 Get My Passport
                </button>
            </motion.form>
            ) : (
            <motion.div
                className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-xl w-full max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <CheckCircle className="w-10 h-10 mb-2 text-green-600" />
                <p className="font-medium text-lg">
                    You're on the list! We’ll be in touch soon 🍽️
                </p>
            </motion.div>
            )}
            <p className="text-xs text-gray-600 mt-2">No spam. Just an invite to your first culinary quest.</p>
        </div>
      </section>

      {/* ===================================================================
        SECTION 2: CORE VALUE PROPOSITION (The Benefits)
        ===================================================================
      */}
      <div className="relative w-full max-w-xl mx-auto mb-8">  
    <img 
        src="img/hero-palau.png" 
        alt="Palau Island Food Discovery" 
        // Ensure you set width/height for Next.js <Image> or let <img> handle it
        className="rounded-3xl shadow-2xl border-4 border-amber-300 transform hover:scale-[1.01] transition duration-500"
    />
</div><section className="w-full py-20 bg-white shadow-inner">
          <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center text-amber-900 mb-12">
    <span className="text-amber-600">T</span>he <span className="text-amber-600">A</span>dventure, <span className="text-amber-600">S</span>tory, <span className="text-amber-600">T</span>radition, &amp; <span className="text-amber-600">E</span>xperience
</h2>
              <div className="grid md:grid-cols-3 gap-10">
                  
                  {/* Card 1: Discovery */}
                  <motion.div
                      className="p-8 bg-amber-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-600"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                  >
                      <Map className="w-10 h-10 text-amber-600 mb-3" />
                      <h3 className="text-2xl font-semibold text-gray-800">Your Cultural Guide to Global Flavor</h3>
                      <p className="mt-2 text-gray-600">
                          Explore beyond your normal diet and find your next craving. Learn the Story with global holidays, food traditions, and insights that will drive your culinary adventure. Check out our rotating Cultural Carousels for inspiration!
                      </p>
                  </motion.div>

                  {/* Card 2: Gamification */}
                  <motion.div
                      className="p-8 bg-amber-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-600"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                  >
                      <Globe className="w-10 h-10 text-amber-600 mb-3" />
                      <h3 className="text-2xl font-semibold text-gray-800">Stamp Your Digital Passport</h3>
                      <p className="mt-2 text-gray-600">
                          Explore the world's cuisines in the most fun way possible. Every dish you taste and log earns you a country stamp, turning your exploration into a rewarding game of learning, discovery, and culinary achievement.
                      </p>
                  </motion.div>

                  {/* Card 3: Journaling */}
                  <motion.div
                      className="p-8 bg-amber-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-amber-600"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                  >
                      <BookOpen className="w-10 h-10 text-amber-600 mb-3" />
                      <h3 className="text-2xl font-semibold text-gray-800">Log Memories, Not Macros.</h3>
                      <p className="mt-2 text-gray-600">
                          Forget calorie tracking. Acquired Taste is a journal built for cultural context and emotional reflection. Capture the story, feel the moment, and experience the world, one meaningful meal at a time.
                      </p>
                  </motion.div>

                  

              </div>
          </div>
      </section>

      {/* ===================================================================
        SECTION 3: CLOSING CTA (Repeated Sign-up)
        ===================================================================
      */}
      <section className="w-full py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-amber-900">
            The World is Waiting. Are You Ready to Taste It?
        </h2>
        <p className="mt-3 text-lg max-w-3xl mx-auto text-gray-700">
            Don't let another amazing meal fade away. Join the movement of cultural explorers who document their journey.
        </p>
         <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} // Scroll to top to sign up
            className="mt-6 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition font-bold text-xl shadow-lg hover:shadow-xl"
        >
            Secure My Spot at the Top (Sign Up!)
        </button>
      </section>

      {/* Footer (Placeholder) */}
      <footer className="w-full py-8 bg-amber-900 text-gray-200">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
              <p>&copy; {new Date().getFullYear()} Acquired Taste. Connecting the world through food.</p>
          </div>
      </footer>

    </main>
  );
}