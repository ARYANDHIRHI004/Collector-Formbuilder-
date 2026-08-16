"use client"
import React, { useState } from "react";
import { Workflow, Mail, ArrowRight, Loader2 } from "lucide-react";
import { loginWithGoogle } from "@/lib/auth-client";

/* Same token system as the landing page, for visual continuity */
const c = {
  bg: "#0A0A0B",
  surface: "#141214",
  surface2: "#1C1A1B",
  border: "#2A2724",
  orange: "#FF5A1F",
  amber: "#FFA53D",
  text: "#F5F1EA",
  muted: "#8B8680",
};

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

/* Faint node-graph texture, reused from the landing page as a quiet
   background motif rather than the hero's foreground element */
function GraphTexture() {
  const nodes = [
    { x: 30, y: 60 },
    { x: 160, y: 20 },
    { x: 160, y: 120 },
    { x: 300, y: 70 },
    { x: 420, y: 30 },
    { x: 420, y: 130 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
  ];
  return (
    <svg
      viewBox="0 0 460 160"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ opacity: 0.35 }}
    >
      {edges.map(([a, b], i) => {
        const f = nodes[a];
        const t = nodes[b];
        const mx = (f.x + t.x) / 2;
        return (
          <path
            key={i}
            d={`M ${f.x} ${f.y} C ${mx} ${f.y}, ${mx} ${t.y}, ${t.x} ${t.y}`}
            fill="none"
            stroke={c.border}
            strokeWidth="1"
          />
        );
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3" fill={i === 3 ? c.orange : c.border} />
      ))}
    </svg>
  );
}

export default function FormForgeSignIn() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [email, setEmail] = useState("");

    const handleLogin = async () => {
      loginWithGoogle()
      console.log("signed in")
    }
  

  return (
    <div
      style={{ backgroundColor: c.bg, minHeight: "100vh" }}
      className="w-full flex items-center justify-center px-6 relative overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
        input:focus, button:focus-visible { outline: 2px solid ${c.orange}; outline-offset: 2px; }
      `}</style>

      <div className="absolute top-0 left-0 right-0 h-[220px]">
        <GraphTexture />
        <div
          style={{
            background: `linear-gradient(to bottom, transparent, ${c.bg})`,
          }}
          className="absolute inset-0"
        />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-8">
          <div
            style={{ backgroundColor: c.orange }}
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          >
            <Workflow size={20} color="#0A0A0B" strokeWidth={2.5} />
          </div>
          <h1
            style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
            className="text-2xl font-semibold tracking-tight mb-1"
          >
            Welcome back
          </h1>
          <p style={{ color: c.muted }} className="text-sm">
            Sign in to keep building your forms
          </p>
        </div>

        <div
          style={{ borderColor: c.border, backgroundColor: c.surface }}
          className="border rounded-xl p-7"
        >
          <button
            onClick={handleLogin}
            disabled={loadingGoogle}
            style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A" }}
            className="w-full flex items-center justify-center gap-3 rounded-md py-2.5 text-sm font-medium hover:brightness-95 transition-all disabled:opacity-70"
          >
            {loadingGoogle ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GoogleGlyph />
            )}
            {loadingGoogle ? "Signing in…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div style={{ backgroundColor: c.border }} className="h-px flex-1" />
            <span
              style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }}
              className="text-xs"
            >
              OR
            </span>
            <div style={{ backgroundColor: c.border }} className="h-px flex-1" />
          </div>

          <label
            style={{ color: c.muted }}
            htmlFor="email"
            className="text-xs font-medium block mb-2"
          >
            Work email
          </label>
          <div className="relative mb-4">
            <Mail
              size={16}
              color={c.muted}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                backgroundColor: c.surface2,
                borderColor: c.border,
                color: c.text,
              }}
              className="w-full border rounded-md pl-9 pr-3 py-2.5 text-sm placeholder:text-[#6B6660]"
            />
          </div>

          <button
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="w-full flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold hover:brightness-110 transition-all"
          >
            Continue with email
            <ArrowRight size={15} />
          </button>
        </div>

        <p style={{ color: c.muted }} className="text-xs text-center mt-6">
          New to FormForge?{" "}
          <a href="#" style={{ color: c.orange }} className="font-medium hover:underline">
            Create an account
          </a>
        </p>

        <p style={{ color: c.muted }} className="text-[11px] text-center mt-4 leading-relaxed">
          By continuing, you agree to FormForge's{" "}
          <a href="#" style={{ color: c.muted }} className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: c.muted }} className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}