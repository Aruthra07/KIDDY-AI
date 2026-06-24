"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";

export default function ContactUsPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // FAQ toggles
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const faqs = [
    { q: "Is Kiddy AI suitable for absolute beginners?", a: "Yes, absolutely! We start with drag-and-drop block coding (Scratch) on Curiosity Island before introducing Python and robotics circuitry. Perfect for ages 6-16." },
    { q: "Do we need physical hardware kits for the robotics course?", a: "No specialized hardware is required! Kiddy AI provides virtual sandbox simulators directly in the browser so kids can program sensors and actuators digitally." },
    { q: "How do parent monitoring features work?", a: "Parents can toggle to the Parent Room dashboard using their child's login. This provides attendance reports, study hours logs, and downloadable weekly PDF summaries." },
    { q: "How can we participate in Seasonal Hackathons?", a: "Seasonal Hackathons are hosted inside our Bootcamp Hub. Register using the student registration modal to receive sandbox entry passes and coordinates details." }
  ];

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-12 font-display">
        
        {/* Banner Title */}
        <section className="text-center max-w-xl mx-auto">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_#1F2937]">
            Support Station
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Contact Kiddy Command
          </h1>
          <p className="text-xs text-gray-500 font-bold mt-1.5">
            Have questions about space quests, seasonal bootcamps, or parent settings? Reach out!
          </p>
        </section>

        {/* TWO COLUMN CONTENT: Form & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Contact Form */}
          <div className="lg:col-span-5 bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-6 text-left">
            <h3 className="text-lg font-black text-brand-dark border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
              <Send size={18} className="text-brand-blue" />
              Send Rocket Mail
            </h3>

            {formSubmitted ? (
              <div className="p-4 bg-brand-green/30 border-2 border-brand-dark rounded-2xl flex flex-col items-center gap-3 text-center py-10">
                <CheckCircle2 size={36} className="text-brand-green" fill="currentColor" />
                <h4 className="text-sm font-black text-brand-dark">Mail Transmitted!</h4>
                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                  Our mascot will fly coordinates reply back to your parent inbox within 24 hours!
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name..."
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="parent@email.com"
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-brand-dark uppercase mb-1">Transmission Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you're curious about..."
                    className="w-full px-3 py-2 border-2 border-brand-dark rounded-xl text-xs font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-3d btn-3d-blue py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Fire Message Rocket
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: FAQs Accordion */}
          <div className="lg:col-span-7 bg-white border-4 border-brand-dark rounded-3xl p-6 shadow-[5px_5px_0px_#1F2937] flex flex-col gap-6 text-left">
            <h3 className="text-lg font-black text-brand-dark border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
              <HelpCircle size={18} className="text-brand-pink" />
              Frequently Asked Questions
            </h3>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-2 border-brand-dark rounded-2xl overflow-hidden bg-brand-cream shadow-sm">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center p-3 text-xs font-black text-brand-dark hover:bg-white transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={14} className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    {isOpen && (
                      <div className="p-3 bg-white border-t border-brand-dark/10 text-xs text-gray-600 font-bold leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
