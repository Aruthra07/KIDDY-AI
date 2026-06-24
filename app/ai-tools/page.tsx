"use client";

import React, { useState } from "react";
import SideNav from "@/components/SideNav";
import { generateWhiteboardCanvas, scanHomework, generateExamPrep } from "@/app/actions/ai";
import { 
  Sparkles, Clipboard, Layers, Image, CheckCircle, FileText, 
  RefreshCw, Upload, Eye, EyeOff, Palette, Camera, PenTool, Check 
} from "lucide-react";

export default function AiToolsPage() {
  const [activeTab, setActiveTab] = useState<"whiteboard" | "scanner" | "prep">("whiteboard");

  // 1. Whiteboard state
  const [whiteboardPrompt, setWhiteboardPrompt] = useState("Photosynthesis flow diagram");
  const [whiteboardCanvas, setWhiteboardCanvas] = useState<any>({
    elements: [
      { id: "1", type: "circle", label: "Sunlight", x: 100, y: 150, color: "#F59E0B" },
      { id: "2", type: "rectangle", label: "Chloroplast (CO2 + Water)", x: 250, y: 135, color: "#10B981" },
      { id: "3", type: "circle", label: "Glucose + Oxygen", x: 450, y: 150, color: "#0EA5E9" }
    ],
    explanation: "Chlorophyll absorbs solar photons to convert carbon dioxide and water into energy-rich sugars, releasing oxygen!"
  });
  const [isWhiteboardLoading, setIsWhiteboardLoading] = useState(false);

  // 2. Scanner state
  const [scannerFile, setScannerFile] = useState<string | null>(null);
  const [scannerQuestion, setScannerQuestion] = useState("Verify my code indentation.");
  const [scannerHints, setScannerHints] = useState("");
  const [isScannerLoading, setIsScannerLoading] = useState(false);

  // Sample image option for prototype review without files
  const sampleHomework = "/download.jpeg";

  // 3. Exam Prep state
  const [prepQuery, setPrepQuery] = useState("CBSE Grade 8 Science - Light reflection");
  const [prepData, setPrepData] = useState<any>({
    revisionSyllabus: ["Introduction to reflection laws", "Spherical Mirrors: Concave & Convex", "Structure of human eye"],
    notes: "Light reflects off smooth surfaces at the same angle it hits (Incident Angle = Reflection Angle). Concave mirrors focus light, whereas convex mirrors spread light rays out.",
    flashcards: [
      { question: "What is the angle of incidence?", answer: "The angle between the incoming ray and the perpendicular line (normal) to the surface." },
      { question: "Which lens is in the human eye?", answer: "A convex crystalline lens focusing light on the retina." }
    ],
    mockQuestions: [
      { question: "Reflection occurs best off which type of surface?", options: ["Rough wood", "Smooth mirror surface", "Water waves"], correctOption: 1 }
    ]
  });
  const [isPrepLoading, setIsPrepLoading] = useState(false);
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null);

  // Call Whiteboard generator
  const handleGenerateWhiteboard = async () => {
    setIsWhiteboardLoading(true);
    try {
      const data = await generateWhiteboardCanvas(whiteboardPrompt);
      if (data && data.elements) {
        setWhiteboardCanvas(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWhiteboardLoading(false);
    }
  };

  // Call Scanner vision generator
  const handleScanHomework = async () => {
    setIsScannerLoading(true);
    // Use sample base64 placeholder or file if uploaded
    const fileToScan = scannerFile || "mock_image_data";
    try {
      const hint = await scanHomework(fileToScan, scannerQuestion);
      setScannerHints(hint);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScannerLoading(false);
    }
  };

  // Call Exam prep CBSE generator
  const handleGenerateExamPrep = async () => {
    setIsPrepLoading(true);
    try {
      const data = await generateExamPrep(prepQuery);
      if (data && data.revisionSyllabus) {
        setPrepData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPrepLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannerFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-light dark:bg-[#0B1120] text-dark dark:text-gray-100 transition-colors duration-200">
      <SideNav />

      <main className="flex-1 flex flex-col min-w-0 font-sans p-6 overflow-y-auto max-h-screen custom-scrollbar font-display">
        
        {/* Sticky Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-card-border dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-accent" size={24} />
              AI Tools Workspace
            </h1>
            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
              Immersive canvas diagram generators, homework helpers, and revision notes loaders
            </p>
          </div>
        </header>

        {/* Tab Selector bar */}
        <section className="flex flex-wrap gap-2 border-b border-card-border dark:border-gray-800 my-6 font-display text-sm font-black pb-2">
          {[
            { id: "whiteboard", label: "AI Whiteboard", desc: "Flowcharts", icon: <Palette size={14} /> },
            { id: "scanner", label: "Homework Scanner", desc: "Hints & OCR", icon: <Camera size={14} /> },
            { id: "prep", label: "CBSE Exam Prep", desc: "Flashcards", icon: <PenTool size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-2 font-bold ${
                activeTab === tab.id ? "bg-accent text-white" : "hover:bg-gray-100 dark:hover:bg-gray-850 text-text-muted"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </section>

        {/* TAB 1: AI WHITEBOARD CANVAS */}
        {activeTab === "whiteboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
            
            {/* Input Form Column */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 border-b border-card-border dark:border-gray-850 pb-2">
                  Generate Logic Flow
                </h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Diagram Topic</label>
                    <input
                      type="text"
                      value={whiteboardPrompt}
                      onChange={(e) => setWhiteboardPrompt(e.target.value)}
                      className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateWhiteboard}
                    disabled={isWhiteboardLoading}
                    className="btn-modern btn-modern-accent w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    {isWhiteboardLoading ? <RefreshCw className="animate-spin" size={14} /> : "Construct Canvas"}
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Render Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase pb-2 mb-4 border-b border-card-border dark:border-gray-800">
                  Interactive Whiteboard Canvas
                </h3>

                {/* Node Board simulation wrapper */}
                <div className="h-80 bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
                  
                  {/* Grid background lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  {/* Elements */}
                  {whiteboardCanvas.elements && whiteboardCanvas.elements.map((el: any) => {
                    const style = {
                      left: `${el.x}px`,
                      top: `${el.y}px`,
                      backgroundColor: el.color || "#0EA5E9"
                    };

                    if (el.type === "circle") {
                      return (
                        <div
                          key={el.id}
                          style={style}
                          className="absolute w-20 h-20 rounded-full border border-black/10 flex items-center justify-center text-center p-2 text-[10px] font-bold text-white shadow-md animate-glow"
                        >
                          {el.label}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={el.id}
                        style={style}
                        className="absolute w-24 h-14 rounded-xl border border-black/10 flex items-center justify-center text-center p-2 text-[10px] font-bold text-white shadow-md"
                      >
                        {el.label}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-950/50 p-4 rounded-xl text-xs font-sans leading-relaxed">
                  <p className="font-bold text-yellow-600">Explanation Note:</p>
                  <p className="text-text-muted mt-1">{whiteboardCanvas.explanation}</p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HOMEWORK SCANNER */}
        {activeTab === "scanner" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
            
            {/* Upload form Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 border-b border-card-border dark:border-gray-850 pb-2">
                  Submit Homework sheet
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Upload sheet (Image/PDF)</label>
                    <div className="border-2 border-dashed border-card-border dark:border-gray-800 rounded-2xl p-6 text-center cursor-pointer hover:bg-bg-light dark:hover:bg-[#0B1120]/40 transition relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-[10px] text-text-muted">Click or drag homework image files</p>
                    </div>
                  </div>

                  {scannerFile && (
                    <div className="border border-card-border dark:border-gray-800 rounded-2xl p-2 relative h-28 flex items-center justify-center overflow-hidden">
                      <img src={scannerFile} className="max-h-full object-contain" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase">What is your question?</label>
                    <input
                      type="text"
                      value={scannerQuestion}
                      onChange={(e) => setScannerQuestion(e.target.value)}
                      placeholder="e.g. Check if I calculated the circuit coordinates correct..."
                      className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleScanHomework}
                    disabled={isScannerLoading}
                    className="btn-modern btn-modern-accent w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    {isScannerLoading ? <RefreshCw className="animate-spin" size={14} /> : "Scan & Analyze"}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Hints display Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase pb-2 mb-4 border-b border-card-border dark:border-gray-800">
                  AI Guiding Feedback (No Answers Revealed!)
                </h3>

                {scannerHints ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/50 p-5 rounded-2xl text-xs text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                    <p className="font-extrabold text-emerald-600 flex items-center gap-1"><CheckCircle size={14} /> Scanner Feedback Hints:</p>
                    <p className="mt-2">{scannerHints}</p>
                  </div>
                ) : (
                  <div className="text-center py-16 text-xs text-text-muted dark:text-gray-400">
                    Upload your homework file and tap Scan to generate logic guidelines!
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CBSE EXAM PREPARATION ENGINE */}
        {activeTab === "prep" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-display">
            
            {/* Query Form Column */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-5 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-3 border-b border-card-border dark:border-gray-850 pb-2">
                  Exam Revision Builder
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-text-muted uppercase">Syllabus Grade/Subject</label>
                    <input
                      type="text"
                      value={prepQuery}
                      onChange={(e) => setPrepQuery(e.target.value)}
                      className="w-full bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-xl py-2 px-3 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateExamPrep}
                    disabled={isPrepLoading}
                    className="btn-modern btn-modern-accent w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    {isPrepLoading ? <RefreshCw className="animate-spin" size={14} /> : "Draft Prep Bundle"}
                  </button>
                </div>
              </div>
            </div>

            {/* Revision contents columns */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Note summary cards */}
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase border-b border-card-border dark:border-gray-800 pb-2 mb-4">
                  Syllabus Plan & Notes
                </h3>
                
                <div className="space-y-4 text-xs font-sans leading-relaxed">
                  <div>
                    <p className="font-bold text-accent">Syllabus chapters checklist:</p>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {prepData.revisionSyllabus && prepData.revisionSyllabus.map((chap: string, idx: number) => (
                        <li key={idx} className="bg-bg-light dark:bg-[#0B1120] border border-card-border dark:border-gray-800 rounded-lg px-2.5 py-1 text-[10px] font-bold flex items-center gap-1">
                          <Check size={10} className="text-accent" />
                          <span>{chap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-bg-light dark:bg-[#0B1120]/40 p-4 rounded-xl border border-card-border dark:border-gray-850">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Notes Overview:</p>
                    <p className="text-text-muted mt-1">{prepData.notes}</p>
                  </div>
                </div>
              </div>

              {/* Interactive Flashcards */}
              <div className="bg-white dark:bg-[#111827] border border-card-border dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase border-b border-card-border dark:border-gray-800 pb-2 mb-4">
                  Interactive Revision Flashcards (Click to Flip!)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prepData.flashcards && prepData.flashcards.map((card: any, idx: number) => {
                    const isFlipped = flippedCardIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setFlippedCardIdx(isFlipped ? null : idx)}
                        className={`h-28 border-2 rounded-2xl p-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 relative select-none ${
                          isFlipped
                            ? "bg-accent text-white border-accent scale-102"
                            : "bg-bg-light dark:bg-[#0B1120]/60 border-card-border dark:border-gray-800 text-gray-850 dark:text-gray-200 hover:border-accent"
                        }`}
                      >
                        <span className="text-[9px] uppercase font-black tracking-wider text-text-muted dark:text-gray-400">
                          {isFlipped ? "Answer" : "Question"}
                        </span>
                        
                        <p className="text-xs font-bold font-sans">
                          {isFlipped ? card.answer : card.question}
                        </p>

                        <span className="text-[8px] font-bold italic opacity-60">Tap to rotate</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
