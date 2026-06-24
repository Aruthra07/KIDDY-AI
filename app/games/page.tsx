"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Trophy, Coins, HelpCircle, RefreshCw, 
  Play, Sparkles, CheckCircle2, ShieldAlert, Clock 
} from "lucide-react";
import confetti from "canvas-confetti";
import EmojiOrSvg from "@/components/visuals/EmojiOrSvg";

export default function GamesCenterPage() {
  const { user, earnXP } = useApp();

  const [activeGame, setActiveGame] = useState<"none" | "puzzle" | "blitz" | "detective">("none");

  // Game 1: Puzzle Cave states
  const [puzzleAnswer, setPuzzleAnswer] = useState("");
  const [puzzleCleared, setPuzzleCleared] = useState(false);

  // Game 2: Brain Blitz states
  const [blitzStarted, setBlitzStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzIndex, setBlitzIndex] = useState(0);
  const [blitzFinished, setBlitzFinished] = useState(false);

  const blitzQuestions = [
    { q: "Which of these is a Python data container?", options: ["backpack()", "print()", "list / array", "cpu"], correct: 2 },
    { q: "What does an ultrasonic sensor send out to scan walls?", options: ["Laser light", "Sound waves", "Magnet force", "Radio fm"], correct: 1 },
    { q: "What is considered the physical metal body of a bot?", options: ["Chassis", "Microprocessor", "Battery", "LCD"], correct: 0 },
    { q: "Which loop repeats until a condition is met?", options: ["for loop", "while loop", "if block", "function"], correct: 1 }
  ];

  // Game 3: AI Detective states
  const [detectiveChoice, setDetectiveChoice] = useState<number | null>(null);
  const [detectiveCleared, setDetectiveCleared] = useState(false);

  // Brain Blitz Ticker
  useEffect(() => {
    if (blitzStarted && timeLeft > 0 && !blitzFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (blitzStarted && timeLeft === 0 && !blitzFinished) {
      handleFinishBlitz();
    }
  }, [blitzStarted, timeLeft, blitzFinished]);

  const handleClearPuzzle = (e: React.FormEvent) => {
    e.preventDefault();
    if (puzzleAnswer.trim() === "48") {
      setPuzzleCleared(true);
      earnXP(20, 15); // Earn XP and Kiddy Coins!
      confetti({
        particleCount: 100,
        spread: 60
      });
    } else {
      alert("Beep! Incorrect coordinate number. Look at the multiplier pattern!");
    }
  };

  const handleStartBlitz = () => {
    setBlitzStarted(true);
    setTimeLeft(30);
    setBlitzScore(0);
    setBlitzIndex(0);
    setBlitzFinished(false);
  };

  const handleAnswerBlitz = (selectedIdx: number) => {
    const isCorrect = selectedIdx === blitzQuestions[blitzIndex].correct;
    if (isCorrect) {
      setBlitzScore(prev => prev + 1);
      confetti({
        particleCount: 20,
        spread: 20
      });
    }

    if (blitzIndex + 1 < blitzQuestions.length) {
      setBlitzIndex(blitzIndex + 1);
    } else {
      handleFinishBlitz();
    }
  };

  const handleFinishBlitz = () => {
    setBlitzFinished(true);
    // Award coins and XP based on score
    const xpReward = blitzScore * 15;
    const coinReward = blitzScore * 10;
    earnXP(xpReward, coinReward);
  };

  const handleClearDetective = (idx: number) => {
    setDetectiveChoice(idx);
    if (idx === 1) { // Chatbot / AI
      setDetectiveCleared(true);
      earnXP(30, 20);
      confetti({
        particleCount: 120,
        spread: 70
      });
    } else {
      alert("Clue does not match! Try reading the neural description again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8 font-display">
        
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-4">
          <span className="bg-brand-pink text-white border-2 border-brand-dark font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase shadow-[2px_2px_0px_var(--card-shadow-color)]">
            Arcade Room
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-dark mt-4">
            Kiddy Play Zone
          </h1>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Test your logic, prompt code speed quizzes, and earn Kiddy Coins to unlock avatar items!
          </p>
        </div>

        {/* ARCADE SELECTOR VIEW */}
        {activeGame === "none" ? (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Game 1: Puzzle Cave */}
            <div className="card-bubble p-6 flex flex-col justify-between items-center text-center gap-6 h-80">
              <div className="flex flex-col items-center gap-3">
                <span className="text-accent shrink-0">
                  <EmojiOrSvg emoji="puzzle" className="w-12 h-12 animate-bounce-slow" />
                </span>
                <h3 className="text-xl font-black text-brand-dark">Puzzle Cave</h3>
                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                  Solve number sequence code patterns and logic coordinates loops.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveGame("puzzle");
                  setPuzzleCleared(false);
                  setPuzzleAnswer("");
                }}
                className="w-full btn-3d btn-3d-blue py-2"
              >
                Enter Cave (+15 Coins)
              </button>
            </div>

            {/* Game 2: Brain Blitz */}
            <div className="card-bubble p-6 flex flex-col justify-between items-center text-center gap-6 h-80">
              <div className="flex flex-col items-center gap-3">
                <span className="text-accent shrink-0">
                  <EmojiOrSvg emoji="zap" className="w-12 h-12 animate-bounce-slow" />
                </span>
                <h3 className="text-xl font-black text-brand-dark">Brain Blitz</h3>
                <p className="text-xs text-gray-650 font-bold leading-relaxed">
                  Ticking speed quiz! Answer correct computer terms before the rocket timer runs out.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveGame("blitz");
                  handleStartBlitz();
                }}
                className="w-full btn-3d btn-3d-pink py-2"
              >
                Initialize Blitz (+30 Coins)
              </button>
            </div>

            {/* Game 3: AI Detective */}
            <div className="card-bubble p-6 flex flex-col justify-between items-center text-center gap-6 h-80">
              <div className="flex flex-col items-center gap-3">
                <span className="text-accent shrink-0">
                  <EmojiOrSvg emoji="compass" className="w-12 h-12 animate-bounce-slow" />
                </span>
                <h3 className="text-xl font-black text-brand-dark">AI Detective</h3>
                <p className="text-xs text-gray-600 font-bold leading-relaxed">
                  Solve mysteries and riddle descriptions by analyzing training datasets logic.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveGame("detective");
                  setDetectiveChoice(null);
                  setDetectiveCleared(false);
                }}
                className="w-full btn-3d btn-3d-green py-2"
              >
                Solve Riddle (+20 Coins)
              </button>
            </div>

          </section>
        ) : (
          /* GAME ACTIVE BOARDS */
          <section className="max-w-2xl mx-auto w-full bg-white border-4 border-brand-dark rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_var(--card-shadow-color)] relative text-left">
            
            <button
              onClick={() => setActiveGame("none")}
              className="absolute top-4 right-4 bg-brand-cream border-2 border-brand-dark px-3 py-1 rounded-full text-xs font-black hover:bg-red-100 transition-colors"
            >
              Exit Arcade
            </button>

            {/* Game 1 Layout: Puzzle Cave */}
            {activeGame === "puzzle" && (
              <div className="flex flex-col gap-5">
                <h3 className="text-xl font-black text-brand-blue border-b-2 border-brand-dark pb-2 flex items-center gap-1.5">
                  <EmojiOrSvg emoji="puzzle" className="w-5 h-5 text-accent" />
                  <span>Puzzle Cave: Pattern Track</span>
                </h3>
                <p className="text-xs text-gray-600 font-bold">
                  A robot rover must double its coordinates speed step at each milestone. Solve the sequence logic below:
                </p>

                <div className="bg-brand-cream border-3 border-brand-dark rounded-2xl p-6 text-center text-2xl font-black tracking-widest text-brand-dark my-4">
                  3 , 6 , 12 , 24 , <span className="text-brand-pink underline font-display">?</span>
                </div>

                {puzzleCleared ? (
                  <div className="bg-brand-green/30 border-2 border-brand-dark rounded-2xl p-4 flex flex-col items-center gap-2 text-center py-6">
                    <CheckCircle2 size={32} className="text-brand-green" fill="currentColor" />
                    <h4 className="text-sm font-black text-brand-dark">Sequence Cleared!</h4>
                    <p className="text-xs text-gray-600 font-bold">Awarded +20 XP, +15 Kiddy Coins!</p>
                  </div>
                ) : (
                  <form onSubmit={handleClearPuzzle} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Input missing number..."
                      required
                      value={puzzleAnswer}
                      onChange={(e) => setPuzzleAnswer(e.target.value)}
                      className="flex-grow px-3 py-2 border-2 border-brand-dark rounded-xl text-sm text-center font-sans font-black"
                    />
                    <button type="submit" className="btn-3d btn-3d-yellow py-2 px-6 text-xs">Verify Number</button>
                  </form>
                )}
              </div>
            )}

            {/* Game 2 Layout: Brain Blitz */}
            {activeGame === "blitz" && (
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center border-b-2 border-brand-dark pb-2">
                  <h3 className="text-xl font-black text-brand-pink flex items-center gap-1.5">
                    <EmojiOrSvg emoji="zap" className="w-5 h-5 text-accent" />
                    <span>Brain Blitz: speed quiz</span>
                  </h3>
                  <div className="flex items-center gap-1.5 bg-brand-cream border-2 border-brand-dark rounded-full px-3 py-1 text-xs font-black">
                    <Clock size={14} className="text-brand-pink" />
                    <span>{timeLeft}s left</span>
                  </div>
                </div>

                {!blitzFinished ? (
                  <div className="flex flex-col gap-4">
                    <div className="bg-brand-cream border border-brand-dark/15 rounded-xl p-4 font-display">
                      <span className="text-[10px] text-gray-400 font-black">Question {blitzIndex + 1} of {blitzQuestions.length}</span>
                      <h4 className="text-sm font-black text-brand-dark mt-1">{blitzQuestions[blitzIndex].q}</h4>
                    </div>

                    <div className="flex flex-col gap-2">
                      {blitzQuestions[blitzIndex].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerBlitz(idx)}
                          className="w-full text-left px-4 py-2.5 border-2 border-brand-dark/20 hover:border-brand-dark hover:bg-brand-sky rounded-xl text-xs font-extrabold transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-pink/10 border-2 border-brand-dark rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                    <Trophy size={48} className="text-brand-yellow fill-brand-yellow stroke-brand-dark" />
                    <div>
                      <h4 className="text-lg font-black text-brand-dark">Blitz Finished!</h4>
                      <p className="text-xs text-gray-600 font-bold mt-1">
                        Cleared {blitzScore} of {blitzQuestions.length} checkpoints.
                      </p>
                    </div>

                    <div className="bg-white border-2 border-brand-dark rounded-xl px-6 py-2.5 font-display text-sm font-black">
                      Rewards: +{blitzScore * 15} XP • {blitzScore * 10} Coins
                    </div>

                    <button
                      onClick={handleStartBlitz}
                      className="btn-3d btn-3d-pink py-2 px-6 text-xs mt-2"
                    >
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw size={14} /> Restart Blitz
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Game 3 Layout: AI Detective */}
            {activeGame === "detective" && (
              <div className="flex flex-col gap-5">
                <h3 className="text-xl font-black text-brand-green flex items-center gap-1.5">
                  <EmojiOrSvg emoji="compass" className="w-5 h-5 text-accent" />
                  <span>AI Detective Riddle</span>
                </h3>
                
                <div className="bg-brand-cream border-2 border-brand-dark rounded-2xl p-4 font-display text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Clue log description:</p>
                  <p className="text-sm font-extrabold text-brand-dark leading-relaxed mt-1">
                    "I am a software bot trained on millions of dialog sentences. I can help students write math loops, generate comic stories, or explain circuits coordinates, but I have no hardware processor body. What am I?"
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {[
                    "Hardware Rover Bot",
                    "Simulated Chatbot / AI Agent",
                    "Electronic Sensor Microcontroller"
                  ].map((opt, idx) => {
                    const isSelected = detectiveChoice === idx;
                    const isCorrect = idx === 1;

                    let btnClass = "bg-brand-cream hover:bg-white border-brand-dark/20";
                    if (isSelected && isCorrect) btnClass = "bg-brand-green border-brand-dark text-brand-dark font-black";
                    if (isSelected && !isCorrect) btnClass = "bg-brand-pink text-white border-brand-dark";

                    return (
                      <button
                        key={idx}
                        onClick={() => handleClearDetective(idx)}
                        disabled={detectiveCleared}
                        className={`w-full text-left px-4 py-3 border-2 rounded-xl text-xs font-extrabold transition-all ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {detectiveCleared && (
                  <div className="bg-brand-green/30 border-2 border-brand-dark rounded-2xl p-4 flex flex-col items-center gap-2 text-center py-6 mt-2">
                    <CheckCircle2 size={32} className="text-brand-green" fill="currentColor" />
                    <h4 className="text-sm font-black text-brand-dark">Riddle Decoded!</h4>
                    <p className="text-xs text-gray-600 font-bold">Awarded +30 XP, +20 Kiddy Coins!</p>
                  </div>
                )}
              </div>
            )}

          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
