"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Mail, Lock, User, GraduationCap, Building2, AlertCircle, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setInfoMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
            role,
            school,
            grade
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg("Verification email sent! Please check your inbox to confirm your account.");
        // Clear fields
        setName("");
        setEmail("");
        setPassword("");
        setSchool("");
        setGrade("");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setErrorMsg(error.message);
    } catch (err) {
      setErrorMsg("Failed to initialize Google OAuth.");
    }
  };

  return (
    <main className="min-h-screen bg-brand-cream flex items-center justify-center p-4 py-12 text-brand-dark font-display">
      <div className="max-w-md w-full bg-card-bg border-4 border-brand-dark rounded-3xl shadow-[5px_5px_0px_var(--card-shadow-color)] p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-brand-blue border-2 border-brand-dark rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[1.5px_1.5px_0px_var(--card-shadow-color)]">
              K
            </div>
            <span className="font-sans text-xl font-black text-brand-dark">
              Kiddy <span className="text-brand-blue">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Create Your Account</h1>
          <p className="text-sm text-text-muted mt-1 font-bold">Begin your guided learning quest today</p>
        </div>

        {/* Error/Info Alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {infoMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-2.5">
            <Sparkles size={18} className="mt-0.5 shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                placeholder="you@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                placeholder="•••••••• (Min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
            >
              <option value="student">Student Explorer</option>
              <option value="parent">Parent Monitor</option>
              <option value="teacher">Instructor / Teacher</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">School (Optional)</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Greenwood"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-1">Grade / Level (Optional)</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Grade 5"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-brand-cream border-2 border-brand-dark rounded-xl text-sm text-brand-dark focus:outline-none focus:bg-card-bg"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-3d btn-3d-blue py-2.5 font-black text-sm flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-brand-dark/15"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card-bg px-3 text-text-muted font-bold">Or Sign Up with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full btn-3d btn-3d-white py-2.5 font-black text-sm flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-text-muted mt-8 font-bold">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-blue hover:underline font-black">Log In</Link>
        </p>
      </div>
    </main>
  );
}
