import "./globals.css";
import type { Metadata } from "next";
import Script from 'next/script'; 

export const metadata: Metadata = {
  title: "Acquired Taste",
  description: "Discover the world through food. Join the beta waitlist for Acquire Taste.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
      {/* 2. Add the first part of the GA script inside the <head> using <Script> */}
      <Script 
        strategy="afterInteractive" // Load script after the page becomes interactive
        src="https://www.googletagmanager.com/gtag/js?id=G-BW34P93HJS"
      />
      
      {/* 3. Add the second part of the GA script using another <Script> tag */}
      <Script 
        id='google-analytics-config' // Give it a unique ID
        strategy="afterInteractive" 
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-BW34P93HJS');
        `}
      </Script>

      <body className="antialiased">{children}</body>
    </html>
  );
}

