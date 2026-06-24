"use client";

import React from "react";
import { 
  GraduationCap, BookOpen, Bot, Code2, Sparkles, Rocket, 
  Compass, Wand2, Glasses, Palette, UserCheck, 
  Coins, Flame, Trophy, Coffee, Apple, HelpCircle,
  Map, Trees, Zap, Mountain, Building2, Gamepad2,
  Award, XCircle, Settings, Check, CheckCircle2, PartyPopper,
  Orbit, Calendar, MessageSquare, AlertTriangle, Clapperboard,
  FileText, Upload, Download, RotateCw, Folder, Hash,
  HeartOff, Heart, FlaskConical, Star, Puzzle, Shield, Key,
  TrendingUp, Smile
} from "lucide-react";

export interface EmojiOrSvgProps {
  emoji: string;
  className?: string;
  size?: number;
}

export default function EmojiOrSvg({ 
  emoji, 
  className = "w-5 h-5", 
  size 
}: EmojiOrSvgProps) {
  const iconProps = {
    className,
    size: size || undefined
  };

  // Standardize the character (remove variation selectors if any)
  const normalizedEmoji = emoji.replace(/[\uFE0F\uE0100-\uE01EF]/g, "").toLowerCase();

  switch (normalizedEmoji) {
    case "🎒":
    case "🎓":
    case "backpack":
    case "graduation":
      return <GraduationCap {...iconProps} />;
    case "📖":
    case "📚":
    case "book":
    case "library":
    case "books":
      return <BookOpen {...iconProps} />;
    case "🤖":
    case "robot":
    case "bot":
      return <Bot {...iconProps} />;
    case "🐍":
    case "python":
    case "code":
      return <Code2 {...iconProps} />;
    case "✨":
    case "🌌":
    case "🌸":
    case "👋":
    case "sparkles":
    case "galaxy":
    case "wave":
      return <Sparkles {...iconProps} />;
    case "🚀":
    case "rocket":
      return <Rocket {...iconProps} />;
    case "👨‍🚀":
    case "compass":
      return <Compass {...iconProps} />;
    case "🧙‍♂️":
    case "🧙":
    case "wand":
    case "wizard":
      return <Wand2 {...iconProps} />;
    case "🕶️":
    case "🕶":
    case "glasses":
      return <Glasses {...iconProps} />;
    case "🦄":
    case "unicorn":
      return <Sparkles {...iconProps} className={`${className} text-pink-400`} />;
    case "🎨":
    case "palette":
    case "art":
      return <Palette {...iconProps} />;
    case "👨‍🏫":
    case "teacher":
      return <UserCheck {...iconProps} />;
    case "🪙":
    case "coin":
    case "coins":
      return <Coins {...iconProps} />;
    case "🔥":
    case "flame":
    case "streak":
      return <Flame {...iconProps} />;
    case "🏆":
    case "trophy":
      return <Trophy {...iconProps} />;
    case "☕":
    case "coffee":
      return <Coffee {...iconProps} />;
    case "🍎":
    case "apple":
      return <Apple {...iconProps} />;
    case "🏝️":
    case "🏝":
    case "map":
    case "island":
      return <Map {...iconProps} />;
    case "🌳":
    case "trees":
    case "forest":
      return <Trees {...iconProps} />;
    case "⚡":
    case "zap":
    case "energy":
      return <Zap {...iconProps} />;
    case "🏔️":
    case "🏔":
    case "mountain":
      return <Mountain {...iconProps} />;
    case "🏙️":
    case "🏙":
    case "building":
    case "city":
      return <Building2 {...iconProps} />;
    case "🎮":
    case "game":
    case "gamepad":
      return <Gamepad2 {...iconProps} />;
    case "🏅":
    case "award":
    case "medal":
      return <Award {...iconProps} />;
    case "❌":
    case "x":
    case "close":
    case "cancel":
      return <XCircle {...iconProps} />;
    case "⚙️":
    case "⚙":
    case "settings":
    case "gear":
      return <Settings {...iconProps} />;
    case "✅":
    case "✓":
    case "check":
    case "success":
      return <CheckCircle2 {...iconProps} />;
    case "🎉":
    case "party":
    case "celebrate":
      return <PartyPopper {...iconProps} />;
    case "🛰️":
    case "🛰":
    case "satellite":
    case "orbit":
      return <Orbit {...iconProps} />;
    case "🗓️":
    case "🗓":
    case "calendar":
      return <Calendar {...iconProps} />;
    case "💬":
    case "message":
    case "chat":
      return <MessageSquare {...iconProps} />;
    case "⚠️":
    case "⚠":
    case "warning":
    case "alert":
      return <AlertTriangle {...iconProps} />;
    case "🎬":
    case "video":
    case "movie":
      return <Clapperboard {...iconProps} />;
    case "📝":
    case "doc":
    case "note":
    case "assignment":
      return <FileText {...iconProps} />;
    case "📤":
    case "upload":
      return <Upload {...iconProps} />;
    case "📥":
    case "download":
      return <Download {...iconProps} />;
    case "🔄":
    case "sync":
    case "reload":
      return <RotateCw {...iconProps} />;
    case "📂":
    case "folder":
      return <Folder {...iconProps} />;
    case "🔢":
    case "number":
    case "binary":
      return <Hash {...iconProps} />;
    case "💔":
    case "broken-heart":
      return <HeartOff {...iconProps} />;
    case "💖":
    case "❤️":
    case "❤":
    case "heart":
      return <Heart {...iconProps} />;
    case "👩‍🔬":
    case "👩":
    case "science":
    case "avatar":
      return <FlaskConical {...iconProps} />;
    case "★":
    case "⭐":
    case "star":
      return <Star {...iconProps} />;
    case "🧩":
    case "puzzle":
      return <Puzzle {...iconProps} />;
    case "🛡️":
    case "🛡":
    case "shield":
      return <Shield {...iconProps} />;
    case "🔑":
    case "key":
      return <Key {...iconProps} />;
    case "🛹":
    case "skateboard":
      return <TrendingUp {...iconProps} />;
    case "🦁":
    case "🦊":
    case "🐯":
    case "🐼":
    case "animal":
    case "smile":
      return <Smile {...iconProps} />;
    
    default:
      return <HelpCircle {...iconProps} />;
  }
}
