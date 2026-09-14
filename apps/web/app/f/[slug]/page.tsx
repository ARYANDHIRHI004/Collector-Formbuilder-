"use client";

import React, { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const c = {
  bg: "#0A0A0B",
  surface: "#141214",
  border: "#2A2724",
  orange: "#FF5A1F",
  text: "#F5F1EA",
  muted: "#8B8680",
};

interface FieldNode {
  id: string;
  data?: {
    fieldType?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
  };
}

function PublicFormInner() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const { data, isLoading, error } = trpc.form.getBySlug.useQuery({ slug });
  console.log(data);
  const submitMutation = trpc.submission.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
        <Loader2 size={28} color={c.orange} className="animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: c.bg }}>
        <p style={{ color: c.muted }}>This form is not available.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: c.bg }}>
        <CheckCircle2 size={40} color="#4ADE80" className="mb-4" />
        <h1 style={{ color: c.text }} className="text-xl font-semibold mb-2">
          Response recorded
        </h1>
        <p style={{ color: c.muted }} className="text-sm">
          Thank you for submitting {data.name}.
        </p>
      </div>
    );
  }

  const fields = (data.nodes as FieldNode[]).filter((node) => node.data?.label);

  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: c.bg }}>
      <div className="max-w-lg mx-auto">
        <h1 style={{ color: c.text, fontFamily: "Space Grotesk, sans-serif" }} className="text-2xl font-semibold mb-2">
          {data.name}
        </h1>
        {data.description && (
          <p style={{ color: c.muted }} className="text-sm mb-8">
            {data.description}
          </p>
        )}

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            submitMutation.mutate({
              formSlug: slug,
              answers: fields.map((field) => ({
                fieldId: field.id,
                value: answers[field.id] ?? null,
              })),
            });
          }}
        >
          {fields.map((field) => {
            const label = field.data?.label ?? "Field";
            const required = field.data?.required ?? false;
            const fieldType = field.data?.fieldType ?? "text";

            return (
              <div key={field.id}>
                <label style={{ color: c.text }} className="text-sm font-medium block mb-1.5">
                  {label}
                  {required && <span style={{ color: c.orange }}> *</span>}
                </label>

                {fieldType === "textarea" ? (
                  <textarea
                    required={required}
                    value={(answers[field.id] as string) ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    style={{ backgroundColor: c.surface, borderColor: c.border, color: c.text }}
                    className="w-full border rounded-md px-3 py-2 text-sm min-h-24"
                  />
                ) : fieldType === "dropdown" || fieldType === "radio" ? (
                  <select
                    required={required}
                    value={(answers[field.id] as string) ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    style={{ backgroundColor: c.surface, borderColor: c.border, color: c.text }}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select…</option>
                    {(field.data?.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={fieldType === "email" ? "email" : fieldType === "number" ? "number" : "text"}
                    required={required}
                    placeholder={field.data?.placeholder}
                    value={(answers[field.id] as string) ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    style={{ backgroundColor: c.surface, borderColor: c.border, color: c.text }}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitMutation.isPending}
            style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
            className="w-full rounded-md py-2.5 text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-60"
          >
            {submitMutation.isPending ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PublicFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <Loader2 size={28} color="#FF5A1F" className="animate-spin" />
        </div>
      }
    >
      <PublicFormInner />
    </Suspense>
  );
}
