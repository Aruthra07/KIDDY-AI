"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12 space-y-8 font-display">
        <div className="card-bubble p-8 space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-brand-dark/10 pb-4">
            <Shield className="text-brand-pink" size={32} />
            <h1 className="text-3xl font-black text-brand-dark dark:text-[#FFF7ED]">
              Privacy Policy
            </h1>
          </div>

          <p className="text-xs text-gray-500 font-bold">Last Updated: June 24, 2026</p>

          <div className="space-y-4 text-xs text-gray-655 dark:text-[#CBD5E1] font-bold leading-relaxed">
            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">1. Information We Collect</h2>
            <p>
              We collect minimal information required to provide our services. This includes student names, avatars, and progress coordinates (XP points, streaks, badges). We do not collect precise location coordinates.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">2. Parental Consent</h2>
            <p>
              We prioritize child safety. Parents can view and manage child account data directly through the Parent Room dashboard. We never share student data with third parties for advertising purposes.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">3. Data Security</h2>
            <p>
              Student accounts are protected using secure Supabase token authentication. Database settings and preferences are encrypted and monitored continuously.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">4. Contact Us</h2>
            <p>
              If you have questions regarding explorer privacy, please email us coordinates at <strong>support@kiddyai.com</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
