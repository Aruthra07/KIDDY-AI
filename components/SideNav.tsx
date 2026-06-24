"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { updateUserTheme } from "@/app/actions/theme";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { 
  Home, Compass, BookOpen, Play, Users, Award, 
  Sun, Moon, Flame, Coins, Shield, ChevronDown, Sparkles
} from "lucide-react";

export default function SideNav() {
  const pathname = usePathname();
  const { user, setUser } = useApp();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = async () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("kiddy_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("kiddy_theme", "light");
    }
    setIsDarkMode(!isDarkMode);

    if (user.id) {
      try {
        await updateUserTheme(user.id, nextTheme);
      } catch (err) {
        console.error("Failed to save theme setting to database:", err);
      }
    }
  };

  const menuItems = [
    { name: "Home Dashboard", href: "/dashboard", icon: Home },
    { name: "Explore Content", href: "/explore", icon: Compass },
    { name: "Learning Hub", href: "/courses", icon: BookOpen },
    { name: "Live Classrooms", href: "/live", icon: Play },
    { name: "AI Tools Lab", href: "/ai-tools", icon: Sparkles },
    { name: "Community Hub", href: "/community", icon: Users }
  ];

  const roles = [
    { name: "Student Explorer", id: "student", avatar: "backpack" },
    { name: "Parent Monitor", id: "parent", avatar: "coffee" },
    { name: "Teacher Studio", id: "teacher", avatar: "apple" },
    { name: "Admin Panel", id: "admin", avatar: "robot" }
  ];

  const handleRoleChange = (roleId: any) => {
    const r = roles.find(item => item.id === roleId);
    setUser(prev => ({
      ...prev,
      role: roleId as any,
      avatar: r?.avatar || "backpack"
    }));
    setRoleDropdownOpen(false);
  };

  const levelProgress = user.xp || 0;

  return (
    <aside className="w-64 border-r-4 border-brand-dark dark:border-[#4A3F35] bg-card-bg h-screen sticky top-0 flex flex-col p-4 justify-between select-none font-display transition-colors duration-200">
      
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2 group">
          <div className="w-9 h-9 bg-brand-yellow border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl flex items-center justify-center text-brand-dark font-black text-lg shadow-[1.5px_1.5px_0px_var(--card-shadow-color)] group-hover:scale-105 transition-transform duration-200">
            K
          </div>
          <span className="font-display text-lg font-black text-gray-900 dark:text-[#FFF7ED]">
            Kiddy <span className="text-brand-blue">AI</span>
          </span>
        </Link>

        {/* Profile Card Summary */}
        <div className="bg-brand-cream dark:bg-[#25201D] rounded-2xl p-4 border-2 border-brand-dark dark:border-[#4A3F35] shadow-[2px_2px_0px_var(--card-shadow-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-sky border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl flex items-center justify-center shrink-0 shadow-[1px_1px_0px_var(--card-shadow-color)]">
              <EmojiOrSvg emoji={user.avatar} className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-black text-gray-900 dark:text-[#FFF7ED] truncate">{user.name}</h4>
              <p className="text-[10px] font-bold text-gray-500 dark:text-[#D6D3D1] uppercase tracking-wider">{user.role}</p>
            </div>
          </div>

          {/* Level Progress */}
          {user.role === "student" && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-[9px] font-black text-gray-600 dark:text-[#D6D3D1] mb-1 uppercase tracking-wider">
                <span>LEVEL {user.level}</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="w-full bg-white dark:bg-[#302923] h-3 border-2 border-brand-dark dark:border-[#4A3F35] rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-brand-blue h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 border-2 rounded-xl text-xs font-bold transition-all duration-100 ${
                  isActive 
                    ? "bg-brand-blue text-white border-brand-dark dark:border-[#4A3F35] shadow-[2px_2px_0px_var(--card-shadow-color)]" 
                    : "text-gray-700 dark:text-[#D6D3D1] border-transparent hover:bg-brand-sky dark:hover:bg-slate-800 hover:border-brand-dark hover:shadow-[2px_2px_0px_var(--card-shadow-color)] hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        {/* Coins and Streak Widgets */}
        {user.role === "student" && (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-orange-50 dark:bg-orange-950/10 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl text-orange-600 dark:text-orange-400 font-black text-[10px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_var(--card-shadow-color)]">
              <Flame size={12} fill="currentColor" />
              <span>{user.streak} Days</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-yellow-50 dark:bg-yellow-950/10 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl text-yellow-600 dark:text-yellow-400 font-black text-[10px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_var(--card-shadow-color)]">
              <Coins size={12} fill="currentColor" />
              <span>{user.coins} Coins</span>
            </div>
          </div>
        )}

        {/* Role Selector dropdown */}
        <div className="relative">
          <button 
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-brand-cream dark:bg-[#25201D] rounded-xl border-2 border-brand-dark dark:border-[#4A3F35] text-xs font-bold text-gray-700 dark:text-[#D6D3D1] shadow-[1.5px_1.5px_0px_var(--card-shadow-color)] cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-brand-blue" />
              Role: {user.role.toUpperCase()}
            </span>
            <ChevronDown size={14} />
          </button>
          
          {roleDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-card-bg border-3 border-brand-dark dark:border-[#4A3F35] rounded-xl shadow-[3px_3px_0px_var(--card-shadow-color)] z-50 overflow-hidden animate-fade-in">
              <div className="p-1 flex flex-col gap-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme and Logout toggles */}
        <div className="flex gap-2 border-t-2 border-brand-dark/10 dark:border-white/10 pt-3">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl text-xs font-bold text-gray-600 dark:text-[#D6D3D1] hover:bg-brand-sky dark:hover:bg-slate-850 cursor-pointer"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </button>
          
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 dark:bg-red-950/10 text-red-600 border-2 border-brand-dark dark:border-[#4A3F35] rounded-xl text-xs font-bold cursor-pointer"
          >
            <span>Exit Portal</span>
          </Link>
        </div>
      </div>
      
    </aside>
  );
}
