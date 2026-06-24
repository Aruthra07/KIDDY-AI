"use client";

import React from "react";
import { Sparkles, Library, Compass, Cpu } from "lucide-react";

export default function KnowledgeMap({ 
  currentProgress = 60 
}: { 
  currentProgress?: number 
}) {
  const nodes = [
    { id: "k1", label: "Loops Logic", x: 60, y: 50, active: true, icon: Cpu },
    { id: "k2", label: "Sensor Coordinates", x: 140, y: 60, active: true, icon: Compass },
    { id: "k3", label: "OpenAI Prompts", x: 80, y: 140, active: currentProgress > 40, icon: Sparkles },
    { id: "k4", label: "Vision Models", x: 160, y: 150, active: currentProgress > 70, icon: Library }
  ];

  return (
    <div className="w-full bg-[#0B1120] border border-gray-800 rounded-3xl p-5 relative overflow-hidden min-h-60 select-none font-display">
      <h3 className="text-xs font-black text-white uppercase border-b border-gray-800 pb-1.5 w-full text-center">
        AI Knowledge Map Nodes
      </h3>

      <div className="relative w-full h-44 mt-3">
        {/* SVG connection rays */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="60" y1="50" x2="140" y2="60" stroke={nodes[1].active ? "#38BDF8" : "var(--card-shadow-color)"} strokeWidth="1.5" />
          <line x1="60" y1="50" x2="80" y2="140" stroke={nodes[2].active ? "#38BDF8" : "var(--card-shadow-color)"} strokeWidth="1.5" />
          <line x1="140" y1="60" x2="160" y2="150" stroke={nodes[3].active ? "#38BDF8" : "var(--card-shadow-color)"} strokeWidth="1.5" />
          <line x1="80" y1="140" x2="160" y2="150" stroke={nodes[3].active ? "#38BDF8" : "var(--card-shadow-color)"} strokeWidth="1.5" />
        </svg>

        {/* Nodes */}
        {nodes.map(n => {
          const Icon = n.icon;
          const style = {
            left: `${n.x}px`,
            top: `${n.y}px`
          };

          return (
            <div
              key={n.id}
              style={style}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl border flex items-center gap-1.5 shadow transition-all ${
                n.active
                  ? "bg-gray-900 border-[#38BDF8] text-white shadow-[#38BDF8]/10"
                  : "bg-gray-950 border-gray-900 text-gray-600"
              }`}
            >
              <Icon size={12} className={n.active ? "text-[#38BDF8] animate-pulse" : ""} />
              <span className="text-[9px] font-black whitespace-nowrap">{n.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
