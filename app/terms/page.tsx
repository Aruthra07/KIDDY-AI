"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12 space-y-8 font-display">
        <div className="card-bubble p-8 space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-brand-dark/10 pb-4">
            <Shield className="text-brand-blue" size={32} />
            <h1 className="text-3xl font-black text-brand-dark dark:text-[#FFF7ED]">
              Terms of Service
            </h1>
          </div>

          <p className="text-xs text-gray-500 font-bold">Last Updated: June 24, 2026</p>

          <div className="space-y-4 text-xs text-gray-650 dark:text-[#CBD5E1] font-bold leading-relaxed">
            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">1. Agreement to Terms</h2>
            <p>
              Welcome to Kiddy AI! By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. If you are under 18, you must have your parent or legal guardian's permission to use the platform.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">2. Description of Service</h2>
            <p>
              Kiddy AI provides space-themed educational resources, coding sandboxes, interactive quizzes, and live classrooms designed for students aged 6–16.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">3. Code of Conduct</h2>
            <p>
              Explorers must interact respectfully in the Community Feed. Bullying, inappropriate language, and sharing personal contact information are strictly prohibited.
            </p>

            <h2 className="text-lg font-black text-brand-dark dark:text-[#FFF7ED] mt-6">4. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or terminate services at any time. We will communicate major changes through our Adventure Logs alert panel.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
