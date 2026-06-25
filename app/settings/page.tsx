"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Settings, Shield, Sparkles, Sun, Moon, Save } from "lucide-react";
import { updateUserTheme } from "@/app/actions/theme";

export default function SettingsPage() {
  const { user, setUser, aiSettings, saveAiSettings, addNotification } = useApp();

  const [openaiKey, setOpenaiKey] = useState(aiSettings.openaiKey);
  const [geminiKey, setGeminiKey] = useState(aiSettings.geminiKey);
  
  const [userName, setUserName] = useState(user.name);
  const [userSchool, setUserSchool] = useState(user.school || "");
  const [userGrade, setUserGrade] = useState(user.grade || "8");

  const [theme, setTheme] = useState<"light" | "dark">("light");

  React.useEffect(() => {
    const saved = localStorage.getItem("kiddy_theme") || "light";
    setTheme(saved as "light" | "dark");
  }, []);

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("kiddy_theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    addNotification(`Theme switched to ${next} mode.`);
    if (user && user.id) {
      updateUserTheme(user.id, next).catch(console.error);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: userName,
      school: userSchool,
      grade: userGrade
    }));
    saveAiSettings(openaiKey, geminiKey);
    addNotification("Settings coordinates updated successfully!");
    alert("Preferences saved successfully!");
  };

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-[#111315] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <header className="py-12 px-6 border-b-4 border-brand-dark dark:border-white/10 bg-brand-sky dark:bg-[#171A1D] relative">
        <div className="max-w-7xl mx-auto">
          <span className="bg-brand-blue text-white border-2 border-brand-dark dark:border-white/15 font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_var(--card-shadow-color)]">
            System coordinates
          </span>
          <h1 className="font-display text-4xl font-black text-brand-dark dark:text-[#FFF7ED] mt-3">
            Explorer Settings
          </h1>
          <p className="font-display text-base font-bold text-gray-700 dark:text-[#CBD5E1] mt-2">
            Configure your AI companion keys, theme display, and school grade coordinates.
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-12">
        <form onSubmit={handleSavePreferences} className="space-y-8 font-display">
          
          {/* Section 1: Visual Theme Toggle */}
          <div className="card-bubble p-6 space-y-4">
            <h2 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2 border-b border-brand-dark/10 pb-2">
              {theme === "light" ? <Sun className="text-brand-yellow" /> : <Moon className="text-brand-blue" />}
              <span>Visual Appearance</span>
            </h2>
            
            <p className="text-xs text-gray-500 dark:text-[#CBD5E1] font-bold leading-relaxed">
              Default mode is Light Mode on your first visit. Choose your preferred workspace view style:
            </p>

            <button
              type="button"
              onClick={handleToggleTheme}
              className="btn-3d btn-3d-white px-6 py-2.5 text-xs font-black flex items-center gap-2"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              <span>Toggle to {theme === "light" ? "Dark Theme" : "Light Theme"}</span>
            </button>
          </div>

          {/* Section 2: Profile Details */}
          <div className="card-bubble p-6 space-y-6">
            <h2 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2 border-b border-brand-dark/10 pb-2">
              <Shield className="text-brand-pink" />
              <span>Explorer Profile coordinates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#CBD5E1] uppercase mb-1">Explorer Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-white border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#CBD5E1] uppercase mb-1">School Base</label>
                <input
                  type="text"
                  value={userSchool}
                  onChange={(e) => setUserSchool(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-white border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#CBD5E1] uppercase mb-1">Grade Level</label>
                <select
                  value={userGrade}
                  onChange={(e) => setUserGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-white border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                >
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: AI Tutor API Config */}
          <div className="card-bubble p-6 space-y-6">
            <h2 className="text-xl font-black text-brand-dark dark:text-[#FFF7ED] flex items-center gap-2 border-b border-brand-dark/10 pb-2">
              <Sparkles className="text-brand-blue" />
              <span>AI Companion API Setup</span>
            </h2>

            <p className="text-xs text-gray-500 dark:text-[#CBD5E1] font-bold leading-relaxed">
              Input custom keys to unlock the live workspace mentor panel. Keys are saved locally on your browser.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#CBD5E1] uppercase mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-white border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#CBD5E1] uppercase mb-1">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-[#111315] text-brand-dark dark:text-white border-2 border-brand-dark dark:border-white/10 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-3d btn-3d-blue py-3 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={18} />
              <span>Save Settings Coordinates</span>
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
}
