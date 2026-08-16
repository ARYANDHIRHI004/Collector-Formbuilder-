import React from "react";
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  Phone,
  Calendar,
  ChevronDown,
  CheckSquare,
  Circle,
  Star,
  Upload,
  GitBranch,
  Users,
  BarChart3,
  Workflow,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  bg        #0A0A0B  near-black canvas                               */
/*  surface   #151316  card surface                                    */
/*  surface2  #1C1A1B  raised surface / hover                          */
/*  border    #2A2724  hairline                                        */
/*  orange    #FF5A1F  primary accent                                  */
/*  amber     #FFA53D  secondary accent / glow                         */
/*  text      #F5F1EA  primary text                                    */
/*  muted     #8B8680  secondary text                                  */
/* ------------------------------------------------------------------ */

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

const fieldTypes = [
  { label: "Text", icon: Type },
  { label: "Textarea", icon: AlignLeft },
  { label: "Email", icon: Mail },
  { label: "Number", icon: Hash },
  { label: "Phone", icon: Phone },
  { label: "Date", icon: Calendar },
  { label: "Dropdown", icon: ChevronDown },
  { label: "Checkbox", icon: CheckSquare },
  { label: "Radio", icon: Circle },
  { label: "Rating", icon: Star },
  { label: "File Upload", icon: Upload },
];

const features = [
  {
    icon: Workflow,
    title: "Visual builder",
    body: "Drag fields onto a canvas and wire them together. See the exact form your respondents will get, live, as you build it.",
  },
  {
    icon: GitBranch,
    title: "Conditional logic",
    body: "Show or hide fields, branch into different paths, and set validation rules — all without touching a line of code.",
  },
  {
    icon: BarChart3,
    title: "Response dashboard",
    body: "Every submission lands in one place. Filter, search, and export to CSV whenever you need the raw data.",
  },
  {
    icon: Users,
    title: "Built for teams",
    body: "Switch between organizations, invite teammates, and control who can edit, publish, or just view responses.",
  },
];

const steps = [
  {
    n: "01",
    title: "Build",
    body: "Drag fields onto the canvas and connect them into a flow that matches how you actually collect information.",
  },
  {
    n: "02",
    title: "Publish",
    body: "Lock the version and get a public link. Every publish is immutable, so you always know what respondents saw.",
  },
  {
    n: "03",
    title: "Collect",
    body: "Responses land in your dashboard the moment they're submitted, no refresh required.",
  },
  {
    n: "04",
    title: "Analyze",
    body: "Filter by field, search submissions, and export a clean CSV whenever you need to go deeper.",
  },
];

/* ------------------------------------------------------------------ */
/*  Signature element: a small node-graph that mirrors FormForge's own */
/*  Nodes / Edges / Settings data model — used in the hero and reused  */
/*  as a quiet motif in the "how it works" section.                    */
/* ------------------------------------------------------------------ */

function NodeGraph({ compact = false }) {
  const nodes = [
    { x: 40, y: 40, label: "Email", icon: Mail },
    { x: 220, y: 20, label: "Branch", icon: GitBranch },
    { x: 220, y: 120, label: "Rating", icon: Star },
    { x: 400, y: 70, label: "Submit", icon: CheckSquare },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
      <svg
        viewBox="0 0 460 180"
        width="100%"
        height={compact ? 140 : 200}
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.orange} stopOpacity="0.9" />
            <stop offset="100%" stopColor={c.amber} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const from = nodes[a];
          const to = nodes[b];
          const midX = (from.x + to.x) / 2;
          const path = `M ${from.x + 44} ${from.y + 18} C ${midX} ${from.y + 18}, ${midX} ${to.y + 18}, ${to.x} ${to.y + 18}`;
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="url(#edgeGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          );
        })}

        {edges.map(([a, b], i) => {
          const from = nodes[a];
          const to = nodes[b];
          const midX = (from.x + to.x) / 2;
          const path = `M ${from.x + 44} ${from.y + 18} C ${midX} ${from.y + 18}, ${midX} ${to.y + 18}, ${to.x} ${to.y + 18}`;
          return (
            <circle key={`dot-${i}`} r="2.6" fill={c.amber}>
              <animateMotion
                dur={`${3 + i * 0.6}s`}
                repeatCount="indefinite"
                path={path}
              />
            </circle>
          );
        })}

        {nodes.map((node, i) => (
          <g key={i} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              width="88"
              height="36"
              rx="9"
              fill={c.surface2}
              stroke={i === nodes.length - 1 ? c.orange : c.border}
              strokeWidth="1.2"
            />
            <circle cx="20" cy="18" r="3" fill={i === 0 ? c.orange : c.muted} />
            <text
              x="34"
              y="22"
              fill={c.text}
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function NavBar() {
  return (
    <header
      style={{ borderBottom: `1px solid ${c.border}` }}
      className="sticky top-0 z-50 backdrop-blur"
    >
      <div
        style={{ backgroundColor: "rgba(10,10,11,0.85)" }}
        className="absolute inset-0 -z-10"
      />
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: c.orange }}
            className="w-7 h-7 rounded-md flex items-center justify-center"
          >
            <Workflow size={16} color="#0A0A0B" strokeWidth={2.5} />
          </div>
          <span
            style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
            className="text-lg font-semibold tracking-tight"
          >
            FormForge
          </span>
        </div>

        <div
          style={{ color: c.muted }}
          className="hidden md:flex items-center gap-8 text-sm"
        >
          <a href="#features" className="hover:opacity-100 opacity-80 transition-opacity">
            Features
          </a>
          <a href="#how" className="hover:opacity-100 opacity-80 transition-opacity">
            How it works
          </a>
          <a href="#pricing" className="hover:opacity-100 opacity-80 transition-opacity">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={"/login"}
            style={{ color: c.text }}
            className="text-sm font-medium px-3 py-2 rounded-md hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2"
          >
            Sign in
          </Link>
          <button
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="text-sm font-semibold px-4 py-2 rounded-md hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Get started
          </button>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div
          style={{
            borderColor: c.border,
            color: c.amber,
            fontFamily: "JetBrains Mono, monospace",
          }}
          className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs mb-6"
        >
          <span style={{ backgroundColor: c.orange }} className="w-1.5 h-1.5 rounded-full" />
          No-code form builder
        </div>

        <h1
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-4xl md:text-5xl font-semibold leading-[1.08] tracking-tight mb-6"
        >
          Build forms like a
          <br />
          flow, not a form.
        </h1>

        <p
          style={{ color: c.muted }}
          className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
        >
          Drag fields onto a canvas, connect them with logic, and publish a
          form your team can trust. FormForge turns every form into a
          versioned, shareable flow — built for organizations, not just
          individuals.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-md hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Start building free
            <ArrowRight size={16} />
          </button>
          <button
            style={{ borderColor: c.border, color: c.text }}
            className="font-medium px-5 py-3 rounded-md border hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2"
          >
            See how it works
          </button>
        </div>

        <p style={{ color: c.muted }} className="text-xs mt-5">
          No credit card required · Free for individuals
        </p>
      </div>

      <div className="relative flex justify-center md:justify-end">
        <div
          style={{
            background: `radial-gradient(circle at 60% 40%, rgba(255,90,31,0.16), transparent 65%)`,
          }}
          className="absolute -inset-10 -z-10"
        />
        <div
          style={{ borderColor: c.border, backgroundColor: c.surface }}
          className="border rounded-2xl p-6 w-full"
        >
          <div style={{ color: c.muted }} className="flex items-center gap-1.5 mb-5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#4a4642" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#4a4642" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.orange }} />
            <span
              style={{ fontFamily: "JetBrains Mono, monospace" }}
              className="ml-2 text-xs"
            >
              contact-intake / v3
            </span>
          </div>
          <NodeGraph />
        </div>
      </div>
    </section>
  );
}

function FieldTypeStrip() {
  return (
    <section style={{ borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-6 overflow-x-auto">
        <div className="flex items-center gap-3 w-max">
          <span
            style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }}
            className="text-xs mr-2 shrink-0"
          >
            FIELD TYPES
          </span>
          {fieldTypes.map(({ label, icon: Icon }) => (
            <div
              key={label}
              style={{ borderColor: c.border, color: c.text }}
              className="flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs shrink-0"
            >
              <Icon size={13} color={c.orange} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="max-w-xl mb-14">
        <span
          style={{ color: c.orange, fontFamily: "JetBrains Mono, monospace" }}
          className="text-xs"
        >
          FEATURES
        </span>
        <h2
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mt-3"
        >
          Everything a team needs, nothing it doesn't.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {features.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            style={{ borderColor: c.border, backgroundColor: c.surface }}
            className="border rounded-xl p-6 hover:border-white/20 transition-colors"
          >
            <div
              style={{ backgroundColor: c.surface2, borderColor: c.border }}
              className="w-9 h-9 rounded-lg border flex items-center justify-center mb-4"
            >
              <Icon size={17} color={c.orange} />
            </div>
            <h3
              style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
              className="text-lg font-medium mb-2"
            >
              {title}
            </h3>
            <p style={{ color: c.muted }} className="text-sm leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how"
      style={{ borderTop: `1px solid ${c.border}`, backgroundColor: "#0C0C0D" }}
      className="py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span
            style={{ color: c.orange, fontFamily: "JetBrains Mono, monospace" }}
            className="text-xs"
          >
            HOW IT WORKS
          </span>
          <h2
            style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
            className="text-3xl md:text-4xl font-semibold tracking-tight mt-3"
          >
            From blank canvas to published flow.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <span
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "transparent",
                  WebkitTextStroke: `1px ${c.border}`,
                }}
                className="text-5xl font-semibold block mb-4"
              >
                {s.n}
              </span>
              <h3
                style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
                className="text-base font-medium mb-2"
              >
                {s.title}
              </h3>
              <p style={{ color: c.muted }} className="text-sm leading-relaxed">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div
                  style={{ backgroundColor: c.border }}
                  className="hidden md:block absolute top-6 -right-3 w-6 h-px"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const free = [
    "Unlimited forms",
    "Core field types",
    "Basic response dashboard",
    "CSV export",
  ];
  const team = [
    "Everything in Free",
    "Custom branding",
    "Higher response limits",
    "Advanced analytics",
    "Integrations",
    "Priority support",
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="max-w-xl mb-14">
        <span
          style={{ color: c.orange, fontFamily: "JetBrains Mono, monospace" }}
          className="text-xs"
        >
          PRICING
        </span>
        <h2
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mt-3"
        >
          Start free. Grow into a team plan.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div style={{ borderColor: c.border, backgroundColor: c.surface }} className="border rounded-xl p-8">
          <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-xl font-medium mb-1">
            Free
          </h3>
          <p style={{ color: c.muted }} className="text-sm mb-6">
            For individuals getting started
          </p>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-3xl font-semibold mb-6">
            ₹0
          </div>
          <ul className="space-y-3 mb-8">
            {free.map((f) => (
              <li key={f} style={{ color: c.muted }} className="flex items-center gap-2 text-sm">
                <Check size={15} color={c.orange} /> {f}
              </li>
            ))}
          </ul>
          <button
            style={{ borderColor: c.border, color: c.text }}
            className="w-full border rounded-md py-2.5 text-sm font-medium hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2"
          >
            Get started
          </button>
        </div>

        <div
          style={{ borderColor: c.orange, backgroundColor: c.surface }}
          className="border-2 rounded-xl p-8 relative"
        >
          <span
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="absolute -top-3 right-8 text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            For teams
          </span>
          <h3 style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-xl font-medium mb-1">
            Team
          </h3>
          <p style={{ color: c.muted }} className="text-sm mb-6">
            For organizations that need more
          </p>
          <div style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-3xl font-semibold mb-6">
            Custom
          </div>
          <ul className="space-y-3 mb-8">
            {team.map((f) => (
              <li key={f} style={{ color: c.muted }} className="flex items-center gap-2 text-sm">
                <Check size={15} color={c.orange} /> {f}
              </li>
            ))}
          </ul>
          <button
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="w-full rounded-md py-2.5 text-sm font-semibold hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2"
          >
            Talk to us
          </button>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-24 text-center">
        <h2
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-3xl md:text-4xl font-semibold tracking-tight mb-4"
        >
          Your next form is one flow away.
        </h2>
        <p style={{ color: c.muted }} className="mb-8 max-w-md mx-auto">
          Build it visually, publish it once, and watch responses come in —
          no code, no guesswork.
        </p>
        <button
          style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-md hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Start building free
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${c.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: c.orange }}
            className="w-6 h-6 rounded-md flex items-center justify-center"
          >
            <Workflow size={13} color="#0A0A0B" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-sm font-medium">
            FormForge
          </span>
        </div>
        <p style={{ color: c.muted }} className="text-xs">
          © {new Date().getFullYear()} FormForge. Built for teams that collect information.
        </p>
      </div>
    </footer>
  );
}

export default function FormForgeLanding() {
  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', sans-serif; }
        button:focus-visible, a:focus-visible { outline-color: ${c.orange}; }
        @media (prefers-reduced-motion: reduce) {
          animateMotion { display: none; }
        }
      `}</style>
      <NavBar />
      <Hero />
      <FieldTypeStrip />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}