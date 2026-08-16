import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Workflow,
  LayoutDashboard,
  FileText,
  Inbox,
  Users,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

/* Same token system used across every FormForge page */
export const c = {
  bg: "#0A0A0B",
  surface: "#141214",
  surface2: "#1C1A1B",
  border: "#2A2724",
  orange: "#FF5A1F",
  amber: "#FFA53D",
  text: "#F5F1EA",
  muted: "#8B8680",
  green: "#4ADE80",
};

export type NavLabel = "Dashboard" | "Forms" | "Responses" | "Members" | "Settings";

interface NavItem {
  icon: LucideIcon;
  label: NavLabel;
  href: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
  { icon: FileText, label: "Forms", href: "forms" },
  { icon: Inbox, label: "Responses", href: "responses" },
  { icon: Users, label: "Members", href: "members" },
  { icon: Settings, label: "Settings", href: "settings" },
];

interface SidebarProps {
  /** Which nav item is highlighted as current. */
  active: NavLabel;
  /** Org name shown in the switcher. */
  orgName?: string;
  /** Plan usage shown in the footer card. Omit to hide the card entirely. */
  usage?: {
    planLabel: string;
    used: number;
    limit: number;
  };
  onOrgSwitchClick?: () => void;
  onUpgradeClick?: () => void;
}

export default function Sidebar({
  active,
  orgName = "Acme Studio",
  usage = { planLabel: "Free plan", used: 1284, limit: 2000 },
  onOrgSwitchClick,
  onUpgradeClick,
}: SidebarProps) {
  const pct = usage ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0;

  return (
    <aside
      style={{ borderColor: c.border, backgroundColor: c.surface }}
      className="hidden md:flex flex-col w-60 shrink-0 border-r h-screen  top-0 px-4 py-5"
    >
      <div className="flex items-center gap-2 px-2 mb-8">
        <div style={{ backgroundColor: c.orange }} className="w-7 h-7 rounded-md flex items-center justify-center">
          <Workflow size={16} color="#0A0A0B" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }} className="text-base font-semibold tracking-tight">
          FormForge
        </span>
      </div>

      <button
        onClick={onOrgSwitchClick}
        style={{ borderColor: c.border, backgroundColor: c.surface2, color: c.text }}
        className="flex items-center justify-between border rounded-md px-3 py-2 mb-6 text-sm hover:bg-white/5 transition-colors"
      >
        <span className="truncate">{orgName}</span>
        <ChevronDown size={14} color={c.muted} />
      </button>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = label === active;
          return (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                color: isActive ? c.text : c.muted,
                backgroundColor: isActive ? c.surface2 : "transparent",
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Icon size={16} color={isActive ? c.orange : c.muted} />
              {label}
            </Link>
          );
        })}
      </nav>

      {usage && (
        <div className="mt-auto">
          <div style={{ borderColor: c.border, backgroundColor: c.surface2 }} className="border rounded-lg p-4">
            <p style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }} className="text-sm font-medium mb-1">
              {usage.planLabel}
            </p>
            <p style={{ color: c.muted }} className="text-xs mb-3">
              {usage.used.toLocaleString()} / {usage.limit.toLocaleString()} responses used
            </p>
            <div style={{ backgroundColor: c.border }} className="h-1.5 rounded-full overflow-hidden mb-3">
              <div style={{ backgroundColor: c.orange, width: `${pct}%` }} className="h-full rounded-full" />
            </div>
            <button
              onClick={onUpgradeClick}
              style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
              className="w-full text-xs font-semibold rounded-md py-2 hover:brightness-110 transition-all"
            >
              Upgrade to Team
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}