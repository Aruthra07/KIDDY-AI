"use client";

import React from "react";

export default function GrowthTree({ 
  stepsCompleted = 3 
}: { 
  stepsCompleted?: number 
}) {
  // Simple rendering of SVG paths that highlight according to stepsCompleted
  const branches = [
    { id: 1, path: "M 100,180 Q 80,120 40,100", active: stepsCompleted >= 1, label: "Variables Unlocked" },
    { id: 2, path: "M 100,180 Q 120,120 160,100", active: stepsCompleted >= 2, label: "Loops Branched" },
    { id: 3, path: "M 100,130 Q 70,80 80,40", active: stepsCompleted >= 3, label: "Circuits Logic" },
    { id: 4, path: "M 100,130 Q 130,80 120,40", active: stepsCompleted >= 4, label: "AI Prompts Crowned" }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col items-center justify-between min-h-60 select-none">
      <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase border-b border-card-border dark:border-gray-850 pb-1.5 w-full text-center">
        Milestones Growth Tree
      </h3>
      
      <div className="relative w-48 h-40">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Main trunk root */}
          <path d="M 100,200 L 100,130" stroke="#78350F" strokeWidth="8" strokeLinecap="round" />
          
          {/* Branches */}
          {branches.map(branch => (
            <g key={branch.id}>
              <path
                d={branch.path}
                fill="none"
                stroke={branch.active ? "#10B981" : "#E5E7EB"}
                strokeWidth={branch.active ? "4" : "2"}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              
              {/* Branch Leaf glow */}
              {branch.active && (
                <circle
                  cx={branch.id === 1 ? 40 : branch.id === 2 ? 160 : branch.id === 3 ? 80 : 120}
                  cy={branch.id === 1 ? 100 : branch.id === 2 ? 100 : branch.id === 3 ? 40 : 40}
                  r="6"
                  fill="#10B981"
                  className="animate-glow"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="text-[9px] text-text-muted dark:text-gray-400 font-bold uppercase tracking-wider text-center">
        Branches grow as you complete quiz checkpoints!
      </div>
    </div>
  );
}
