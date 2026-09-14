"use client";

import React from "react";
import { Clock, FileText, Inbox, Loader2 } from "lucide-react";
import Sidebar, { c } from "@/components/SideBar";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { formatRelativeDate } from "@/lib/format-date";

export default function FormForgeResponses() {
  const { data: responses = [], isLoading } = trpc.submission.listRecent.useQuery({
    limit: 25,
  });

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh" }} className="w-full flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
      <Sidebar active="Responses" />

      <div className="flex-1 min-w-0">
        <div
          style={{ borderColor: c.border }}
          className="flex items-center justify-between border-b px-6 md:px-8 py-4"
        >
          <div>
            <h1
              style={{ fontFamily: "Space Grotesk, sans-serif", color: c.text }}
              className="text-xl font-semibold tracking-tight"
            >
              Responses
            </h1>
            <p style={{ color: c.muted }} className="text-sm">
              Recent submissions across all your forms.
            </p>
          </div>
        </div>

        <div className="px-6 md:px-8 py-8">
          <div
            style={{ borderColor: c.border, backgroundColor: c.surface }}
            className="border rounded-xl overflow-hidden"
          >
            <div
              style={{ borderColor: c.border, color: c.muted }}
              className="grid grid-cols-[1fr_1fr_160px] gap-4 border-b px-5 py-3 text-xs font-medium"
            >
              <span>Form</span>
              <span>Submission ID</span>
              <span>Submitted</span>
            </div>

            {isLoading && (
              <div className="px-5 py-12 flex justify-center">
                <Loader2 size={24} color={c.muted} className="animate-spin" />
              </div>
            )}

            {!isLoading && responses.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div
                  style={{ backgroundColor: c.surface2, borderColor: c.border }}
                  className="w-11 h-11 rounded-lg border flex items-center justify-center mx-auto mb-4"
                >
                  <Inbox size={18} color={c.muted} />
                </div>
                <p style={{ color: c.text }} className="text-sm font-medium mb-1">
                  No responses yet
                </p>
                <p style={{ color: c.muted }} className="text-sm mb-5">
                  Publish a form and share it to start collecting submissions.
                </p>
                <Link
                  href="/forms"
                  style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-md px-4 py-2 hover:brightness-110 transition-all"
                >
                  <FileText size={15} />
                  View forms
                </Link>
              </div>
            )}

            {!isLoading &&
              responses.map((row, i) => (
                <div
                  key={row.id}
                  style={{
                    borderColor: i === responses.length - 1 ? "transparent" : c.border,
                  }}
                  className="grid grid-cols-[1fr_1fr_160px] gap-4 items-center border-b px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <span style={{ color: c.text }} className="text-sm font-medium truncate">
                    {row.formName}
                  </span>
                  <span
                    style={{ color: c.muted, fontFamily: "JetBrains Mono, monospace" }}
                    className="text-xs truncate"
                  >
                    {row.id.slice(0, 8)}…
                  </span>
                  <span style={{ color: c.muted }} className="flex items-center gap-1.5 text-xs">
                    <Clock size={12} />
                    {formatRelativeDate(row.submittedAt)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
