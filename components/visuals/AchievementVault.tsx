"use client";

import React from "react";
import { ShieldCheck, Calendar, Award, ExternalLink } from "lucide-react";

interface Certificate {
  id: string;
  courseTitle: string;
  certificateNumber: string;
  issueDate: string;
}

export default function AchievementVault({ 
  certificates = [] 
}: { 
  certificates?: Certificate[] 
}) {
  const defaultCertificates = [
    { id: "1", courseTitle: "Robotics Rookie: virtual bots", certificateNumber: "KIDDY-883109", issueDate: "23/06/2026" },
    { id: "2", courseTitle: "Python Explorer: first game", certificateNumber: "KIDDY-449102", issueDate: "20/06/2026" }
  ];

  const list = certificates.length > 0 ? certificates : defaultCertificates;

  return (
    <div className="w-full bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col gap-4 select-none font-display">
      <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase border-b border-card-border dark:border-gray-850 pb-1.5 flex items-center gap-1.5">
        <Award size={14} className="text-brand-pink" /> Interactive Achievement Vault
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-56 overflow-y-auto no-scrollbar">
        {list.map(cert => (
          <div
            key={cert.id}
            className="border border-card-border dark:border-gray-800 rounded-2xl p-4 bg-bg-light dark:bg-[#0B1120]/40 flex justify-between items-center gap-3 relative overflow-hidden group hover:border-[#0ea5e9]/40 transition"
          >
            {/* Plaque visual container */}
            <div className="min-w-0 flex-1">
              <span className="bg-[#0EA5E9]/10 text-accent text-[8px] font-black uppercase px-2 py-0.5 rounded border border-[#0EA5E9]/20 flex items-center gap-0.5 w-max">
                <ShieldCheck size={10} /> Verified Plaque
              </span>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-2 truncate">{cert.courseTitle}</h4>
              <p className="text-[9px] text-text-muted mt-1">ID: {cert.certificateNumber} • {cert.issueDate}</p>
            </div>

            {/* QR Code mockup */}
            <div className="w-12 h-12 bg-white p-1 border border-card-border dark:border-gray-800 rounded-lg shrink-0 flex items-center justify-center relative group-hover:scale-105 transition">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                {/* Simulated QR Code patterns */}
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="10" y="10" width="10" height="10" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="white" />
                {/* Noise bits */}
                <rect x="40" y="10" width="10" height="15" fill="currentColor" />
                <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                <rect x="75" y="75" width="15" height="15" fill="currentColor" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
