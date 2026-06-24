"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { 
  Menu, X, Bell, Flame, Coins, Award, Shield, 
  ChevronDown, Settings, Sparkles, LogOut, CheckCircle2, Check 
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { 
    user, setUser, notifications, clearNotifications,
    aiSettings, saveAiSettings 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Navigation Learn Dropdown State
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);

  // AI API settings local state
  const [openaiKey, setOpenaiKey] = useState(aiSettings.openaiKey);
  const [geminiKey, setGeminiKey] = useState(aiSettings.geminiKey);

  const mainNavigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
  ];

  const roles = [
    { name: "Student Explorer", id: "student", color: "bg-brand-blue text-white" },
    { name: "Parent Guide", id: "parent", color: "bg-brand-pink text-white" },
    { name: "Teacher Studio", id: "teacher", color: "bg-brand-green text-gray-900" },
    { name: "Admin Space", id: "admin", color: "bg-brand-yellow text-gray-900" },
  ];

  const handleRoleChange = (roleId: any) => {
    const avatars = { student: "backpack", parent: "coffee", teacher: "apple", admin: "robot" };
    setUser(prev => ({
      ...prev,
      role: roleId,
      avatar: avatars[roleId as keyof typeof avatars] || "backpack"
    }));
    setRoleDropdownOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAiSettings(openaiKey, geminiKey);
    setSettingsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-card-bg border-b-4 border-brand-dark dark:border-[#4A3F35] shadow-md px-4 py-2 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl overflow-hidden shadow-[2px_2px_0px_var(--card-shadow-color)] group-hover:scale-105 transition-transform duration-200 bg-brand-yellow">
            <Image 
              src="/logo.jpg" 
              alt="Kiddy AI Logo" 
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-[#FFF7ED]">
            Kiddy <span className="text-brand-blue">AI</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-1.5 font-display">
          {/* Home & Explore */}
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-150 ${
                  isActive 
                    ? "bg-brand-blue text-white border-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)]" 
                    : "text-gray-700 dark:text-[#D6D3D1] border-transparent hover:bg-brand-sky dark:hover:bg-slate-800 hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Learn (Dropdown Trigger) */}
          <div 
            className="relative"
            onMouseEnter={() => setLearnDropdownOpen(true)}
            onMouseLeave={() => setLearnDropdownOpen(false)}
          >
            <button
              type="button"
              className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                pathname === "/courses" || pathname === "/live"
                  ? "bg-brand-blue text-white border-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)]"
                  : "text-gray-700 dark:text-[#D6D3D1] border-transparent hover:bg-brand-sky dark:hover:bg-slate-800 hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>Learn</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${learnDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {learnDropdownOpen && (
              <div className="absolute left-0 mt-1 w-44 bg-card-bg border-3 border-brand-dark dark:border-[#4A3F35] rounded-2xl shadow-[4px_4px_0px_var(--card-shadow-color)] overflow-hidden z-50 animate-fade-in">
                <Link 
                  href="/courses" 
                  className={`block px-4 py-2.5 text-xs font-bold transition-colors ${
                    pathname === "/courses"
                      ? "bg-brand-blue text-white"
                      : "text-gray-700 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Learning Hub
                </Link>
                <Link 
                  href="/live" 
                  className={`block px-4 py-2.5 text-xs font-bold transition-colors border-t-2 border-brand-dark/10 dark:border-[#4A3F35]/30 ${
                    pathname === "/live"
                      ? "bg-brand-blue text-white"
                      : "text-gray-700 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Live Learn
                </Link>
              </div>
            )}
          </div>

          {/* Community */}
          <Link
            href="/community"
            className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-150 ${
              pathname === "/community"
                ? "bg-brand-blue text-white border-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)]"
                : "text-gray-700 dark:text-[#D6D3D1] border-transparent hover:bg-brand-sky dark:hover:bg-slate-800 hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Community
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-150 ${
              pathname === "/contact"
                ? "bg-brand-blue text-white border-brand-dark shadow-[2px_2px_0px_var(--card-shadow-color)]"
                : "text-gray-700 dark:text-[#D6D3D1] border-transparent hover:bg-brand-sky dark:hover:bg-slate-800 hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* PROTOTYPE STATS & ROLE SELECTOR */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Student Stats (shown for student role) */}
          {user.role === "student" && (
            <div className="flex items-center gap-2 bg-brand-cream dark:bg-[#25201D] border-2 border-brand-dark dark:border-[#4A3F35] rounded-full px-3 py-1 text-sm font-bold">
              <div className="flex items-center gap-1 text-orange-500" title="Daily Streak">
                <Flame size={18} fill="currentColor" />
                <span>{user.streak}</span>
              </div>
              <div className="w-[2px] h-4 bg-brand-dark/20 dark:bg-white/10" />
              <div className="flex items-center gap-1 text-brand-pink" title="Kiddy Coins">
                <Coins size={18} fill="currentColor" className="text-brand-yellow stroke-brand-dark dark:stroke-[#4A3F35]" />
                <span>{user.coins}</span>
              </div>
              <div className="w-[2px] h-4 bg-brand-dark/20 dark:bg-white/10" />
              <div className="flex items-center gap-1 text-brand-blue" title="XP Level">
                <Award size={18} />
                <span>Lv.{user.level}</span>
              </div>
            </div>
          )}

          {/* Quick Dashboard Links based on Role */}
          <Link
            href={user.role === "parent" ? "/parent" : user.role === "teacher" || user.role === "admin" ? "/admin" : "/dashboard"}
            className="px-4 py-1.5 bg-brand-pink text-white font-display text-sm font-bold border-2 border-brand-dark rounded-full shadow-[2px_2px_0px_var(--card-shadow-color)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_var(--card-shadow-color)] active:translate-y-[1px] active:shadow-[1px_1px_0px_var(--card-shadow-color)] transition-all flex items-center gap-1.5"
          >
            <span>My Workspace</span>
            <EmojiOrSvg emoji={user.avatar} className="w-4 h-4 text-white" />
          </Link>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-card-bg border-2 border-brand-dark dark:border-[#4A3F35] rounded-full text-xs font-bold font-display shadow-[2px_2px_0px_var(--card-shadow-color)] hover:bg-brand-sky dark:hover:bg-slate-850 transition-colors cursor-pointer"
            >
              <Shield size={14} className="text-brand-blue" />
              <span>Role: {user.role.toUpperCase()}</span>
              <ChevronDown size={14} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card-bg border-3 border-brand-dark dark:border-[#4A3F35] rounded-2xl shadow-[4px_4px_0px_var(--card-shadow-color)] overflow-hidden z-50">
                <div className="px-3 py-2 bg-brand-sky dark:bg-[#25201D] border-b-2 border-brand-dark dark:border-[#4A3F35] font-display text-xs font-bold text-gray-900 dark:text-[#FFF7ED]">
                  Toggle Prototype Role
                </div>
                <div className="p-1.5 flex flex-col gap-1">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer ${
                        user.role === r.id ? r.color : "hover:bg-brand-cream dark:hover:bg-slate-800 text-gray-700 dark:text-[#D6D3D1]"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Panel */}
          <div className="relative">
            <button 
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 border-2 border-brand-dark dark:border-[#4A3F35] rounded-full hover:bg-brand-sky dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-pink border-2 border-brand-dark dark:border-[#4A3F35] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card-bg border-3 border-brand-dark dark:border-[#4A3F35] rounded-2xl shadow-[4px_4px_0px_var(--card-shadow-color)] overflow-hidden z-50">
                <div className="p-3 bg-brand-blue text-white font-display font-bold flex items-center justify-between border-b-3 border-brand-dark dark:border-[#4A3F35]">
                  <span>Adventure Logs</span>
                  <button onClick={clearNotifications} className="text-xs underline hover:text-brand-yellow font-sans cursor-pointer">Clear</button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y-2 divide-brand-dark/10 dark:divide-white/10 p-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs py-6 text-gray-500 dark:text-gray-450 font-display">No new alerts. Keep exploring!</p>
                  ) : (
                    notifications.map((msg, idx) => (
                      <div key={idx} className="p-2.5 text-xs text-gray-800 dark:text-gray-200 font-display font-medium">
                        {msg}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Developer API Key Panel Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 border-2 border-brand-dark dark:border-[#4A3F35] rounded-full hover:bg-brand-sky dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="AI Config Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="flex lg:hidden items-center gap-2">
          {user.role === "student" && (
            <div className="flex items-center gap-1.5 bg-brand-cream dark:bg-[#25201D] border-2 border-brand-dark dark:border-[#4A3F35] rounded-full px-2 py-0.5 text-xs font-bold">
              <Coins size={14} className="text-brand-yellow stroke-brand-dark dark:stroke-[#4A3F35] fill-brand-yellow" />
              <span>{user.coins}</span>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl bg-card-bg hover:bg-brand-sky dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU NAV */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-3 border-brand-dark dark:border-[#4A3F35] mt-2 pt-3 pb-4 flex flex-col gap-2 font-display bg-card-bg z-40 relative">
          
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-base font-bold text-brand-dark dark:text-white hover:bg-brand-sky dark:hover:bg-slate-800 border-2 border-transparent hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)]"
          >
            Home
          </Link>

          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-base font-bold text-brand-dark dark:text-white hover:bg-brand-sky dark:hover:bg-slate-800 border-2 border-transparent hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)]"
          >
            Explore
          </Link>

          {/* Mobile Learn Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
              className="w-full text-left px-3 py-2 rounded-xl text-base font-bold text-brand-dark dark:text-white hover:bg-brand-sky dark:hover:bg-slate-800 border-2 border-transparent hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] flex items-center justify-between"
            >
              <span>Learn</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${mobileLearnOpen ? "rotate-180" : ""}`} />
            </button>
            
            {mobileLearnOpen && (
              <div className="pl-6 flex flex-col gap-1 mt-1 border-l-2 border-brand-dark/20 ml-5 py-1">
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800"
                >
                  Learning Hub
                </Link>
                <Link
                  href="/live"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800"
                >
                  Live Learn
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-base font-bold text-brand-dark dark:text-white hover:bg-brand-sky dark:hover:bg-slate-800 border-2 border-transparent hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)]"
          >
            Community
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-xl text-base font-bold text-brand-dark dark:text-white hover:bg-brand-sky dark:hover:bg-slate-800 border-2 border-transparent hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)]"
          >
            Contact
          </Link>

          <div className="h-[2px] bg-brand-dark/10 dark:bg-white/10 my-1" />
          
          {/* Mobile role select */}
          <div className="px-3 py-1 text-xs font-bold text-gray-500">SWITCH PROFILE ROLE:</div>
          <div className="grid grid-cols-2 gap-2 px-3">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  handleRoleChange(r.id);
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-center border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl text-xs font-bold ${
                  user.role === r.id ? r.color : "bg-card-bg text-brand-dark dark:text-white"
                }`}
              >
                {r.name.split(" ")[0]} {user.role === r.id ? <Check size={12} className="inline ml-1" /> : ""}
              </button>
            ))}
          </div>

          <div className="mt-4 px-3 flex gap-2">
            <Link
              href={user.role === "parent" ? "/parent" : user.role === "teacher" || user.role === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 bg-brand-pink text-white font-bold border-2 border-brand-dark rounded-xl shadow-[3px_3px_0px_var(--card-shadow-color)] flex items-center justify-center gap-1.5"
            >
              <span>My Dashboard</span>
              <EmojiOrSvg emoji={user.avatar} className="w-4 h-4 text-white" />
            </Link>
            <button
              onClick={() => {
                setSettingsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="p-2.5 border-2 border-brand-dark rounded-xl bg-brand-yellow cursor-pointer"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      )}

      {/* DEVELOPER AI SETTINGS MODAL */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-bg border-4 border-brand-dark dark:border-[#4A3F35] rounded-3xl p-6 max-w-md w-full shadow-[6px_6px_0px_var(--card-shadow-color)]">
            <div className="flex items-center justify-between mb-4 border-b-3 border-brand-dark dark:border-[#4A3F35] pb-3">
              <h3 className="font-display text-xl font-bold flex items-center gap-2 text-brand-blue">
                <Sparkles size={20} className="text-brand-yellow fill-brand-yellow stroke-brand-dark animate-pulse" />
                AI Tutor Config Setup
              </h3>
              <button onClick={() => setSettingsOpen(false)} className="p-1.5 border-2 border-brand-dark dark:border-[#4A3F35] rounded-full hover:bg-red-100 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-[#D6D3D1] mb-4 leading-relaxed font-sans">
              Enter your API keys below to unlock the <strong>Live AI Tutor Sidebar</strong>. By default, Kiddy AI uses interactive mock explanations. Setting keys enables real-time responses! Keys are stored solely in your local browser.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4 font-display">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#D6D3D1] uppercase mb-1">OpenAI API Key (Optional)</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-brand-dark dark:border-gray-700 rounded-xl text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-[#D6D3D1] uppercase mb-1">Gemini API Key (Optional)</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-cream dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-brand-dark dark:border-gray-700 rounded-xl text-sm font-sans placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="flex-1 py-2 border-2 border-brand-dark dark:border-gray-700 rounded-xl font-bold text-sm bg-brand-cream dark:bg-slate-900 text-gray-750 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brand-green border-2 border-brand-dark dark:border-gray-700 rounded-xl font-bold text-sm text-gray-900 shadow-[2px_2px_0px_var(--card-shadow-color)] hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer"
                >
                  Save Keys
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
