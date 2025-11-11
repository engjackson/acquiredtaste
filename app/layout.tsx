import "./globals.css";
import type { Metadata } from "next";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
