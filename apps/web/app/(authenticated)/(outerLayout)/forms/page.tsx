"use client";

import React, { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Circle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Copy,
  Archive,
  ExternalLink,
  Pencil,
  Loader2,
} from "lucide-react";
import Sidebar, { c } from "@/components/SideBar";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { formatRelativeDate } from "@/lib/format-date";

type FormStatus = "published" | "draft";
type FormFilter = "all" | FormStatus;
type ViewMode = "grid" | "list";
type SortKey = "recent" | "responses" | "name";

function MiniGraph({ seed, accent }: { seed: number; accent: boolean }) {
  const base = [
    { x: 8, y: 26 },
    { x: 48, y: 10 },
    { x: 48, y: 42 },
    { x: 88, y: 26 },
  ];
  const jitter = (seed % 3) * 3;
  const nodes = base.map((n, i) => ({ ...n, y: n.y + (i % 2 === 0 ? jitter : -jitter) }));
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];
  return (
    <svg viewBox="0 0 96 52" width="96" height="52" aria-hidden="true">
      {edges.map(([a, b], i) => {
        const f = nodes[a]!;
        const t = nodes[b]!;
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
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 3 ? 3.2 : 2.4}
          fill={i === 3 && accent ? c.orange : c.border}
        />
      ))}
    </svg>
  );
}

function StatusPill({ status }: { status: FormStatus }) {
  const isPublished = status === "published";
  return (
    <span
      style={{
        color: isPublished ? c.green : c.amber,
        backgroundColor: isPublished ? "rgba(74,222,128,0.1)" : "rgba(255,165,61,0.1)",
      }}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full shrink-0"
    >
      {isPublished ? <CheckCircle2 size={11} /> : <Circle size={11} />}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function ActionMenu({
  open,
  onClose,
  formId,
  slug,
  status,
}: {
  open: boolean;
  onClose: () => void;
  formId: string;
  slug: string;
  status: FormStatus;
}) {
  if (!open) return null;

  const items: { icon: LucideIcon; label: string; danger?: boolean; href?: string }[] = [
    { icon: Pencil, label: "Edit", href: `/create-form?id=${formId}` },
    ...(status === "published"
      ? [{ icon: ExternalLink, label: "View live form", href: `/f/${slug}` }]
      : []),
    { icon: Copy, label: "Duplicate" },
    { icon: Archive, label: "Archive", danger: true },
  ];

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        style={{ borderColor: c.border, backgroundColor: c.surface2 }}
        className="absolute right-0 top-8 z-20 w-44 border rounded-lg py-1.5 shadow-xl"
      >
        {items.map(({ icon: Icon, label, danger, href }) =>
          href ? (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              style={{ color: danger ? "#F87171" : c.text }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left"
            >
              <Icon size={14} color={danger ? "#F87171" : c.muted} />
              {label}
            </Link>
          ) : (
            <button
              key={label}
              style={{ color: danger ? "#F87171" : c.text }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/5 transition-colors text-left"
            >
              <Icon size={14} color={danger ? "#F87171" : c.muted} />
              {label}
            </button>
          ),
        )}
      </div>
    </>
  );
}

function FormCard({
  form,
  index,
}: {
  form: {
    id: string;
    name: string;
    slug: string;
    status: string;
    responseCount: number;
    updatedAt: Date | string;
  };
  index: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = form.status as FormStatus;

  return (
    <div
      style={{ borderColor: c.border, backgroundColor: c.surface }}
      className="border rounded-xl p-5 hover:border-white/20 transition-colors relative"
    >
      <div className="flex items-start justify-between mb-4">
        <Link href={`/create-form?id=${form.id}`}>
          <MiniGraph seed={index} accent={status === "published"} />
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded-md hover:bg-white/5 transition-colors"
            aria-label="Form actions"
          >
            <MoreHorizontal size={16} color={c.muted} />
          </button>
          <ActionMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            formId={form.id}
            slug={form.slug}
            status={status}
          />
        </div>
      </div>

      <Link href={`/create-form?id=${form.id}`}>
        <h3
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-sm font-medium mb-2 truncate"
        >
          {form.name}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <StatusPill status={status} />
      </div>

      <div style={{ borderColor: c.border }} className="border-t pt-3 flex items-center justify-between">
        <span style={{ color: c.text, fontFamily: "JetBrains Mono, monospace" }} className="text-xs">
          {form.responseCount.toLocaleString()} responses
        </span>
        <span style={{ color: c.muted }} className="flex items-center gap-1 text-xs">
          <Clock size={11} />
          {formatRelativeDate(form.updatedAt)}
        </span>
      </div>
    </div>
  );
}

function FormRow({
  form,
}: {
  form: {
    id: string;
    name: string;
    slug: string;
    status: string;
    responseCount: number;
    updatedAt: Date | string;
  };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = form.status as FormStatus;

  return (
    <div
      style={{ borderColor: c.border }}
      className="grid grid-cols-2 sm:grid-cols-[1fr_120px_100px_140px_40px] gap-4 items-center border-b px-5 py-4 hover:bg-white/[0.03] transition-colors last:border-b-0"
    >
      <Link href={`/create-form?id=${form.id}`} className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <div
          style={{ backgroundColor: c.surface2, borderColor: c.border }}
          className="w-8 h-8 rounded-md border flex items-center justify-center shrink-0"
        >
          <FileText size={14} color={c.orange} />
        </div>
        <span style={{ color: c.text }} className="text-sm font-medium truncate">
          {form.name}
        </span>
      </Link>
      <div>
        <StatusPill status={status} />
      </div>
      <span style={{ color: c.text }} className="text-sm">
        {form.responseCount.toLocaleString()}
      </span>
      <span style={{ color: c.muted }} className="flex items-center gap-1.5 text-xs">
        <Clock size={12} />
        {formatRelativeDate(form.updatedAt)}
      </span>
      <div className="relative text-right">
        <button onClick={() => setMenuOpen((v) => !v)} aria-label="Form actions">
          <MoreHorizontal size={16} color={c.muted} />
        </button>
        <ActionMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          formId={form.id}
          slug={form.slug}
          status={status}
        />
      </div>
    </div>
  );
}

function EmptyState({ filter }: { filter: FormFilter }) {
  return (
    <div
      style={{ borderColor: c.border, backgroundColor: c.surface }}
      className="border rounded-xl py-16 text-center"
    >
      <div
        style={{ backgroundColor: c.surface2, borderColor: c.border }}
        className="w-11 h-11 rounded-lg border flex items-center justify-center mx-auto mb-4"
      >
        <FileText size={18} color={c.muted} />
      </div>
      <p
        style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }}
        className="text-sm font-medium mb-1"
      >
        No {filter === "all" ? "" : filter} forms yet
      </p>
      <p style={{ color: c.muted }} className="text-sm mb-5">
        {filter === "draft"
          ? "Forms you haven't published will show up here."
          : "Create your first form to get started."}
      </p>
      <Link
        href="/create-form"
        style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
        className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-md px-4 py-2 hover:brightness-110 transition-all"
      >
        <Plus size={15} />
        New form
      </Link>
    </div>
  );
}

export default function FormForgeForms() {
  const [filter, setFilter] = useState<FormFilter>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("recent");
  const [query, setQuery] = useState<string>("");

  const { data: forms = [], isLoading } = trpc.form.list.useQuery();

  const filtered = useMemo(() => {
    return forms
      .filter((f) => filter === "all" || f.status === filter)
      .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === "recent") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sort === "responses") return b.responseCount - a.responseCount;
        return a.name.localeCompare(b.name);
      });
  }, [forms, filter, query, sort]);

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh" }} className="w-full flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', sans-serif; }
        input:focus, button:focus-visible, a:focus-visible { outline: 2px solid ${c.orange}; outline-offset: 2px; }
      `}</style>
      <Sidebar active="Forms" />

      <div className="flex-1 min-w-0">
        <div
          style={{ borderColor: c.border }}
          className="flex flex-wrap items-center justify-between gap-4 border-b px-6 md:px-8 py-4"
        >
          <div>
            <h1
              style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
              className="text-xl font-semibold tracking-tight"
            >
              Forms
            </h1>
            <p style={{ color: c.muted }} className="text-sm">
              {forms.length} forms
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} color={c.muted} className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search forms…"
                style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
                className="border rounded-md pl-9 pr-3 py-2 text-sm w-48 sm:w-56 placeholder:text-[#6B6660]"
              />
            </div>
            <Link
              href="/create-form"
              style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
              className="flex items-center gap-1.5 text-sm font-semibold rounded-md px-3.5 py-2 hover:brightness-110 transition-all"
            >
              <Plus size={15} />
              New form
            </Link>
          </div>
        </div>

        <div className="px-6 md:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-1">
              {(["all", "published", "draft"] as FormFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    color: filter === f ? "#0A0A0B" : c.muted,
                    backgroundColor: filter === f ? c.orange : "transparent",
                  }}
                  className="text-xs font-medium px-3 py-1.5 rounded-full capitalize hover:opacity-90 transition-opacity"
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
                  className="appearance-none border rounded-md pl-3 pr-8 py-1.5 text-xs cursor-pointer"
                >
                  <option value="recent">Last edited</option>
                  <option value="responses">Most responses</option>
                  <option value="name">Name (A–Z)</option>
                </select>
                <ChevronDown
                  size={13}
                  color={c.muted}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>

              <div style={{ borderColor: c.border }} className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  style={{ backgroundColor: view === "grid" ? c.surface2 : "transparent" }}
                  className="p-1.5"
                  aria-label="Grid view"
                >
                  <LayoutGrid size={14} color={view === "grid" ? c.orange : c.muted} />
                </button>
                <button
                  onClick={() => setView("list")}
                  style={{ backgroundColor: view === "list" ? c.surface2 : "transparent" }}
                  className="p-1.5"
                  aria-label="List view"
                >
                  <List size={14} color={view === "list" ? c.orange : c.muted} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} color={c.muted} className="animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : view === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((f, i) => (
                <FormCard key={f.id} form={f} index={i} />
              ))}
            </div>
          ) : (
            <div
              style={{ borderColor: c.border, backgroundColor: c.surface }}
              className="border rounded-xl overflow-hidden"
            >
              <div
                style={{ borderColor: c.border, color: c.muted }}
                className="hidden sm:grid grid-cols-[1fr_120px_100px_140px_40px] gap-4 border-b px-5 py-3 text-xs font-medium"
              >
                <span>Name</span>
                <span>Status</span>
                <span>Responses</span>
                <span>Last edited</span>
                <span />
              </div>
              {filtered.map((f) => (
                <FormRow key={f.id} form={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
