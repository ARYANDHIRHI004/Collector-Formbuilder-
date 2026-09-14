"use client";

import React, { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  Circle,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import Sidebar, { c } from "@/components/SideBar";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { formatRelativeDate } from "@/lib/format-date";

type FormStatus = "published" | "draft";
type FormFilter = "all" | FormStatus;

function TopBar() {
  return (
    <div
      style={{ borderColor: c.border }}
      className="flex items-center justify-between border-b px-6 md:px-8 py-4"
    >
      <div>
        <h1
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-xl font-semibold tracking-tight"
        >
          Dashboard
        </h1>
        <p style={{ color: c.muted }} className="text-sm">
          Welcome back — here's what's happening across your forms.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search
            size={15}
            color={c.muted}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            placeholder="Search forms…"
            style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
            className="border rounded-md pl-9 pr-3 py-2 text-sm w-52 placeholder:text-[#6B6660]"
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
  );
}

function StatsRow() {
  const { data, isLoading } = trpc.form.dashboardStats.useQuery();

  const stats = [
    { label: "Total forms", value: data?.totalForms ?? 0, delta: null },
    { label: "Published", value: data?.publishedForms ?? 0, delta: null },
    { label: "Total responses", value: data?.totalResponses ?? 0, delta: null },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-8 pt-6">
      {stats.map((s) => (
        <div
          key={s.label}
          style={{ borderColor: c.border, backgroundColor: c.surface }}
          className="border rounded-xl p-5"
        >
          <p style={{ color: c.muted }} className="text-xs mb-2">
            {s.label}
          </p>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <Loader2 size={20} color={c.muted} className="animate-spin" />
            ) : (
              <span
                style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
                className="text-2xl font-semibold"
              >
                {s.value.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
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
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
    >
      {isPublished ? <CheckCircle2 size={11} /> : <Circle size={11} />}
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function FormsList() {
  const [filter, setFilter] = useState<FormFilter>("all");
  const { data: forms = [], isLoading } = trpc.form.list.useQuery();

  const filtered = useMemo(
    () => forms.filter((f) => filter === "all" || f.status === filter),
    [forms, filter],
  );

  return (
    <div className="px-6 md:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
          className="text-base font-medium"
        >
          Your forms
        </h2>
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
      </div>

      <div style={{ borderColor: c.border, backgroundColor: c.surface }} className="border rounded-xl overflow-hidden">
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

        {isLoading && (
          <div className="px-5 py-10 flex justify-center">
            <Loader2 size={24} color={c.muted} className="animate-spin" />
          </div>
        )}

        {!isLoading &&
          filtered.map((f, i) => (
            <div
              key={f.id}
              style={{ borderColor: i === filtered.length - 1 ? "transparent" : c.border }}
              className="grid grid-cols-2 sm:grid-cols-[1fr_120px_100px_140px_40px] gap-4 items-center border-b px-5 py-4 hover:bg-white/[0.03] transition-colors"
            >
              <Link
                href={`/create-form?id=${f.id}`}
                className="flex items-center gap-3 col-span-2 sm:col-span-1"
              >
                <div
                  style={{ backgroundColor: c.surface2, borderColor: c.border }}
                  className="w-8 h-8 rounded-md border flex items-center justify-center shrink-0"
                >
                  <FileText size={14} color={c.orange} />
                </div>
                <span style={{ color: c.text }} className="text-sm font-medium truncate">
                  {f.name}
                </span>
              </Link>
              <div>
                <StatusPill status={f.status as FormStatus} />
              </div>
              <span style={{ color: c.text }} className="text-sm">
                {f.responseCount.toLocaleString()}
              </span>
              <span style={{ color: c.muted }} className="flex items-center gap-1.5 text-xs">
                <Clock size={12} />
                {formatRelativeDate(f.updatedAt)}
              </span>
              <button className="text-right" aria-label="Form actions">
                <MoreHorizontal size={16} color={c.muted} />
              </button>
            </div>
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p style={{ color: c.muted }} className="text-sm mb-4">
              No {filter === "all" ? "" : filter} forms yet.
            </p>
            <Link
              href="/create-form"
              style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-md px-4 py-2 hover:brightness-110 transition-all"
            >
              <Plus size={15} />
              Create your first form
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FormForgeDashboard() {
  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh" }} className="w-full flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', sans-serif; }
        input:focus, button:focus-visible, a:focus-visible { outline: 2px solid ${c.orange}; outline-offset: 2px; }
      `}</style>
      <Sidebar active="Dashboard" />
      <div className="flex-1 min-w-0">
        <TopBar />
        <StatsRow />
        <FormsList />
      </div>
    </div>
  );
}
