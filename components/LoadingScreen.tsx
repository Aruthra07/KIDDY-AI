"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const LOADING_MESSAGES = [
  "Preparing your learning space...",
  "Loading your next adventure...",
  "Setting up your courses...",
  "Connecting to your learning hub...",
  "Almost ready..."
];

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Message rotator (every 2 seconds)
    const messageInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Smooth progress bar simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          if (onComplete) {
            setTimeout(onComplete, 600); // Buffer for exit animations
          }
          return 100;
        }
        // Increment progress gradually
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.96,
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream dark:bg-[#1A1714] border-8 border-brand-dark dark:border-[#4A3F35] p-6 transition-colors duration-200"
    >
      <div className="max-w-md w-full text-center flex flex-col items-center relative">
        
        {/* Animated Brand Logo Container */}
        <div className="relative mb-10 w-44 h-44 flex items-center justify-center">
          
          {/* Subtle Rotating Decorative Stars Around Logo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Star 1 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-brand-yellow">
              <Star size={16} fill="currentColor" className="stroke-brand-dark dark:stroke-[#4A3F35] stroke-2" />
            </div>
            {/* Star 2 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-brand-pink">
              <Star size={20} fill="currentColor" className="stroke-brand-dark dark:stroke-[#4A3F35] stroke-2" />
            </div>
            {/* Star 3 */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 text-brand-blue">
              <Star size={18} fill="currentColor" className="stroke-brand-dark dark:stroke-[#4A3F35] stroke-2" />
            </div>
            {/* Star 4 */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-brand-green">
              <Star size={16} fill="currentColor" className="stroke-brand-dark dark:stroke-[#4A3F35] stroke-2" />
            </div>
          </motion.div>

          {/* Gentle Pulsing & Floating Logo Frame */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            className="relative w-32 h-32 md:w-36 md:h-36 bg-white border-4 border-brand-dark dark:border-[#4A3F35] rounded-3xl overflow-hidden shadow-[4px_4px_0px_var(--card-shadow-color)] z-10 flex items-center justify-center"
          >
            <Image 
              src="/logo.jpg" 
              alt="Kiddy AI Logo" 
              fill
              className="object-cover p-1.5 rounded-2xl"
              priority
            />
          </motion.div>
        </div>

        {/* Title and Loading Messages */}
        <h2 className="font-display text-2xl md:text-3xl font-black text-brand-dark dark:text-[#FFF7ED] mb-3 uppercase tracking-wider">
          Kiddy AI
        </h2>

        <div className="h-10 flex items-center justify-center mb-8 w-full px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-display text-sm font-bold text-gray-700 dark:text-[#D6D3D1] max-w-xs leading-relaxed"
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Custom Play-Colored Progress Bar */}
        <div className="w-full max-w-xs flex flex-col items-center gap-2">
          <div className="relative w-full h-5 bg-white dark:bg-[#302923] border-3 border-brand-dark dark:border-[#4A3F35] rounded-full overflow-hidden shadow-inner">
            
            {/* Colorful Progress Strip */}
            <motion.div
              className="h-full bg-gradient-to-r from-brand-blue via-brand-pink to-brand-green border-r-2 border-brand-dark dark:border-[#4A3F35] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
            />
          </div>
          <span className="font-display text-[10px] font-black text-brand-dark dark:text-[#D6D3D1] uppercase tracking-widest">
            Leveling Up: {progress}%
          </span>
        </div>

      </div>
    </motion.div>
  );
}
