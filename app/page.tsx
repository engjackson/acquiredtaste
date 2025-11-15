'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Globe, Goal, Utensils } from "lucide-react";


// --- COLOR PALETTE DEFINITION ---
const PRIMARY_COLOR = '#FF7A00'; // Spiced Orange (Buttons, Primary Links)
const PRIMARY_HOVER_COLOR = '#E56F00'; // Slightly darker orange for hover
const ACCENT_COLOR = '#007C91'; // Teal Voyage (Secondary accents, sub-headings)
const BG_COLOR = '#F9F4EC';     // Warm Sand (Page Background)
const TEXT_COLOR = '#2E2E2E';   // Deep Charcoal (Main Text, H1/H2)
const WHITE_RING = '#FFFFFF'; // Used for the centered screenshot border


export default function Home() {
const [email, setEmail] = useState("");
const [firstName, setFirstName] = useState("");
const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!email || !email.includes("@") || !firstName) return;


 setSubmitted(true);
 setEmail("");
 setFirstName("");
};

return (
 <main
  className={`min-h-screen flex flex-col items-center justify-between font-sans pb-20`}
  style={{ backgroundColor: BG_COLOR, color: TEXT_COLOR }}
 >

 {/* ===================================================================
  SECTION 1: HERO & SIGN-UP
  ===================================================================
 */}
 <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 text-center w-full max-w-7xl flex-grow">
  <motion.div
   initial={{ opacity: 0, y: -20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.6 }}
  >
  
   {/* LOGO IMAGE */}
   <img
    src="/img/acquireduni.png"
    alt="Acquired  Logo"
    className="max-w-xs md:max-w-md mx-auto mb-6 h-auto"
   />

   {/* App Name - H1 */}
   <h1
    className={`text-4xl md:text-6xl font-black leading-tight mb-4 tracking-widest uppercase`}
    style={{ color: TEXT_COLOR }}
   >
    ACQUIRED 
   </h1>
  
   {/* Tagline - H2 */}
   <h2
    className="text-3xl font-bold mb-2"
    style={{ color: TEXT_COLOR }}
   >
     the World.
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
    Acquired  is your new best friend for your food adventure! Log your entire food journey, whether you're cooking a meal at home or dining out. We're here to help you get culturally fluent, one delicious bite at a time. Find out about upcoming global holidays and traditions, and discover the awesome dishes served to celebrate them. Food is the universal party starter! Break out of your comfort zone, try new cuisines, and turn every single meal into a fun, rewarding, educational quest. In the long run, the app will use your preferred s, ingredients, and dining history to recommend new food adventures you're guaranteed to love.
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
     className={`flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}] text-gray-800`}
     required
    />
    <input
     type="email"
     placeholder="Email address"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     className={`flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[${PRIMARY_COLOR}] text-gray-800`}
     required
    />
    <button
     type="submit"
     className="px-6 py-3 text-white rounded-xl transition font-medium text-lg flex-shrink-0"
     style={{ backgroundColor: PRIMARY_COLOR }}
     onMouseOver={(e) => e.currentTarget.style.backgroundColor = PRIMARY_HOVER_COLOR}
     onMouseOut={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
    >
     Reserve My Spot
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
    <p className={`font-medium text-lg`} style={{ color: TEXT_COLOR }}>
     You're on the list! We’ll be in touch soon 🍽️
    </p>
   </motion.div>
   )}
   <p className="text-xs text-gray-600 mt-2">No spam. Just an exclusive beta invite and occasional feedback requests to help us grow the app.</p>
  </div>
 </section>

 {/* ===================================================================
  APP SCREENSHOT GALLERY (RESPONSIVE)
  ===================================================================
 */}
 <div className="w-full max-w-6xl mx-auto my-12 px-6">
  
   {/* -----------------------------------------------------------------
   MOBILE SCREENSHOT GALLERY (Vertical Stack)
   Visible on mobile (< md), hidden on desktop (>= md)
   ----------------------------------------------------------------- */}
   <div className="flex flex-col items-center space-y-6 pt-12 md:hidden">
   
    {/* Mobile Screenshot 1: Dashboard */}
    <motion.img
     src="/img/screenshot-dashboard.png"
     alt="Acquired  Dashboard showing home dashboard"
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
     alt="Acquired  Explore Swipe card for new dishes"
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
     alt="Acquired  Cultural Feasts list"
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
   
    
    <motion.img
     src="/img/screenshot-dashboard.png"
     alt="Acquired  Dashboard showing home dashboard"
     // Simple sizing and transition effect
     className="w-64 h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.05]"
     style={{ borderColor: ACCENT_COLOR, borderWidth: '4px' }}
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.5, delay: 0.1 }}
    />
    
    <motion.img
     src="/img/screenshot-explore.png"
     alt="Acquired  Explore Swipe card for new dishes"
     // Simple sizing and transition effect, border to highlight focus
     className="w-64 h-auto rounded-3xl shadow-2xl transition duration-500 hover:scale-[1.05]"
     style={{ borderColor: WHITE_RING, borderWidth: '8px', outline: `4px solid ${PRIMARY_COLOR}` }}
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.5, delay: 0.2 }}
    />
    
    <motion.img
     src="/img/screenshot-passport.png"
     alt="Acquired  Cultural Feasts list"
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
  ===================================================================
 */}
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
      Every dish you log earns you a country stamp, turning your culinary exploration into a rewarding game of discovery and achievement. Track your world journey, one meal at a time.
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
      Break out of your comfort zone with fun monthly challenges like the *experience a noodle from any country in Asia*. Complete the quest goals and earn exclusive Bronze, Silver, and Gold badges.
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
  ===================================================================
 */}
 <section className="w-full py-16 px-6 text-center">
  <h2 className="text-3xl font-bold" style={{ color: TEXT_COLOR }}>
   The World is Waiting. Are You Ready to  It?
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

 {/* Footer (Placeholder) */}
 <footer
  className="w-full py-8 text-gray-200"
  style={{ backgroundColor: TEXT_COLOR }}
 >
  <div className="max-w-6xl mx-auto px-6 text-center text-sm space-y-2">
   <p>&copy; {new Date().getFullYear()} Acquired . Connecting the world through food.</p>
   <p>
    Questions or feedback? Email us:
    <a
     href="mailto:acquired.app@gmail.com"
     className="text-white underline hover:text-red-300 transition"
    >
     acquired.app@gmail.com
    </a>
   </p>
  </div>
 </footer>

 </main>
);
}