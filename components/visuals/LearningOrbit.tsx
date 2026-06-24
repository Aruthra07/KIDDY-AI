"use client";

import React from "react";
import EmojiOrSvg from "./EmojiOrSvg";

interface OrbitItem {
  id: string;
  title: string;
  thumbnail: string;
}

export default function LearningOrbit({ 
  avatar = "backpack", 
  items = [] 
}: { 
  avatar?: string; 
  items?: OrbitItem[] 
}) {
  // Safe defaults if empty
  const orbitItems = items.length > 0 ? items : [
    { id: "1", title: "Robotics", thumbnail: "robot" },
    { id: "2", title: "Python Explorer", thumbnail: "python" },
    { id: "3", title: "AI Magic", thumbnail: "sparkles" }
  ];

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-64 h-64 border-2 border-dashed border-[#0EA5E9]/15 rounded-full flex items-center justify-center select-none">
        
        {/* Core center node */}
        <div className="w-20 h-20 bg-accent border-4 border-card-border dark:border-gray-800 rounded-full flex items-center justify-center shadow-lg relative z-20 animate-bounce-slow text-white">
          <EmojiOrSvg emoji={avatar} className="w-10 h-10" />
        </div>

        {/* Orbit track ring */}
        <div className="absolute w-48 h-48 border border-dashed border-[#0EA5E9]/25 rounded-full animate-spin-slow" />

        {/* Orbital orbiting items */}
        {orbitItems.map((item, idx) => {
          const total = orbitItems.length;
          const angle = (idx / total) * 2 * Math.PI;
          const radius = 96; // Orbit distance radius
          const x = Math.round(radius * Math.cos(angle));
          const y = Math.round(radius * Math.sin(angle));

          const style = {
            transform: `translate(${x}px, ${y}px)`
          };

          return (
            <div
              key={item.id}
              style={style}
              className="absolute w-10 h-10 bg-white dark:bg-gray-900 border border-card-border dark:border-gray-800 rounded-xl flex items-center justify-center shadow-md z-10 transition-transform hover:scale-110 text-accent dark:text-[#38BDF8]"
              title={item.title}
            >
              <EmojiOrSvg emoji={item.thumbnail} className="w-5 h-5" />
            </div>
          );
        })}

      </div>
    </div>
  );
}
