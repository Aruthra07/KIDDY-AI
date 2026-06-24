"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Rocket, Sparkles } from "lucide-react";

const LOADING_MESSAGES = [
  "Learning powers your future.",
  "Curiosity unlocks possibilities.",
  "Every question creates growth.",
  "Assembling robotic gearwheels...",
  "Fueling learning rockets...",
  "Powering up your AI tutor..."
];

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Message rotator
    const messageInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    // Progress bar simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          if (onComplete) {
            setTimeout(onComplete, 400); // Small buffer for exit animation
          }
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream border-8 border-brand-dark p-6"
    >
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Floating Mascot */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-brand-yellow rounded-full border-4 border-brand-dark flex items-center justify-center shadow-lg">
            <Bot size={64} className="text-brand-dark" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-2 -right-2 bg-brand-pink text-white p-2 rounded-full border-2 border-brand-dark"
          >
            <Sparkles size={20} />
          </motion.div>
        </motion.div>

        {/* Mascot Speech Bubble */}
        <div className="relative bg-white border-4 border-brand-dark rounded-2xl p-4 mb-8 shadow-md speech-bubble speech-bubble-border w-full">
          <div className="relative bg-white z-10 font-display text-lg text-brand-dark">
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                "{LOADING_MESSAGES[msgIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Rocket Progress */}
        <div className="relative w-full h-8 bg-white border-4 border-brand-dark rounded-full overflow-hidden shadow-inner mb-3">
          <motion.div
            className="h-full bg-brand-green border-r-4 border-brand-dark flex items-center justify-end pr-4 transition-all duration-150"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <Rocket size={18} className="text-brand-dark animate-pulse rotate-95" />
          </motion.div>
        </div>
        <p className="font-display text-sm text-brand-dark uppercase tracking-wider">
          Rocket Power: {Math.min(progress, 100)}%
        </p>
      </div>
    </motion.div>
  );
}
