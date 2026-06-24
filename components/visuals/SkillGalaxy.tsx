"use client";

import React from "react";
import { Award, Compass, Sparkles, Terminal } from "lucide-react";

interface SkillNode {
  name: string;
  unlocked: boolean;
  x: number;
  y: number;
  icon: any;
}

export default function SkillGalaxy({ 
  skills = [] 
}: { 
  skills?: SkillNode[] 
}) {
  const defaultSkills = [
    { name: "Logic Loops", unlocked: true, x: 20, y: 15, icon: Terminal },
    { name: "Electronics Sensors", unlocked: true, x: 75, y: 25, icon: Compass },
    { name: "Prompt Crafting", unlocked: false, x: 35, y: 70, icon: Sparkles },
    { name: "Math Coordinates", unlocked: false, x: 80, y: 75, icon: Award }
  ];

  const activeSkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <div className="w-full bg-[#0B1120] border border-gray-800 rounded-3xl p-5 relative overflow-hidden min-h-60 select-none">
      
      {/* Space galaxy dust atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* SVG Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line x1="20%" y1="15%" x2="75%" y2="25%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
        <line x1="20%" y1="15%" x2="35%" y2="70%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
        <line x1="75%" y1="25%" x2="80%" y2="75%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
        <line x1="35%" y1="70%" x2="80%" y2="75%" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
      </svg>

      {/* Render nodes */}
      {activeSkills.map((node) => {
        const Icon = node.icon;
        const style = {
          left: `${node.x}%`,
          top: `${node.y}%`
        };

        return (
          <div
            key={node.name}
            style={style}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer group`}
          >
            {/* Glowing Star Sphere Node */}
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition shadow-lg ${
              node.unlocked 
                ? "bg-[#38BDF8]/20 border-[#38BDF8] text-[#38BDF8] animate-glow" 
                : "bg-gray-900 border-gray-800 text-gray-500"
            }`}>
              <Icon size={12} />
            </div>

            {/* Tooltip name */}
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border whitespace-nowrap bg-[#111827] shadow ${
              node.unlocked 
                ? "text-white border-[#38BDF8]/40" 
                : "text-gray-500 border-gray-850"
            }`}>
              {node.name}
            </span>
          </div>
        );
      })}

    </div>
  );
}
