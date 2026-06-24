"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { updateUserTheme } from "@/app/actions/theme";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";
import { 
  Home, Compass, BookOpen, Layers, Play, FolderClosed, 
  Users, Award, Sun, Moon, Flame, Coins, ShieldAlert,
  User, Shield, ChevronDown, Sparkles, Trophy, Rss, Video
} from "lucide-react";

export default function SideNav() {
  const pathname = usePathname();
  const { user, setUser, earnXP } = useApp();
  
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

    // Save to DB if user session exists
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

  const levelProgress = user.xp || 0; // 0 to 100

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0 flex flex-col p-4 justify-between select-none">
      
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 bg-[#0EA5E9] rounded-xl flex items-center justify-center text-white font-black text-lg">
            K
          </div>
          <span className="font-sans text-lg font-bold text-gray-900 dark:text-white">
            Kiddy <span className="text-[#0EA5E9]">AI</span>
          </span>
        </Link>

        {/* Profile Card Summary */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 dark:bg-[#38BDF8]/10 text-accent dark:text-[#38BDF8] border border-accent/20 dark:border-[#38BDF8]/20 rounded-xl flex items-center justify-center shrink-0">
              <EmojiOrSvg emoji={user.avatar} className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>

          {/* Level Progress */}
          {user.role === "student" && (
            <div className="mt-4">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 dark:text-gray-400 mb-1">
                <span>LEVEL {user.level}</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0EA5E9] h-full transition-all duration-300"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  isActive 
                    ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850"
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
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-950/50 rounded-xl text-orange-600 font-bold text-xs">
              <Flame size={14} fill="currentColor" />
              <span>{user.streak} Days</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-950/50 rounded-xl text-yellow-600 font-bold text-xs">
              <Coins size={14} fill="currentColor" />
              <span>{user.coins} Coins</span>
            </div>
          </div>
        )}

        {/* Role Selector dropdown */}
        <div className="relative">
          <button 
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-[#0EA5E9]" />
              Role: {user.role.toUpperCase()}
            </span>
            <ChevronDown size={14} />
          </button>
          
          {roleDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-1.5 flex flex-col gap-1">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-850 cursor-pointer"
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme and Logout toggles */}
        <div className="flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isDarkMode ? "Light" : "Dark"}</span>
          </button>
          
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-100 dark:border-red-950/50 rounded-xl text-xs font-bold cursor-pointer"
          >
            <span>Exit Portal</span>
          </Link>
        </div>
      </div>
      
    </aside>
  );
}
