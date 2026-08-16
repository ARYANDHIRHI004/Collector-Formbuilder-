import { Plus, Search } from "lucide-react";

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

export function TopBar() {
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
        <button
          style={{ backgroundColor: c.orange, color: "#0A0A0B" }}
          className="flex items-center gap-1.5 text-sm font-semibold rounded-md px-3.5 py-2 hover:brightness-110 transition-all"
        >
          <Plus size={15} />
          New form
        </button>
        <div
          style={{ backgroundColor: c.surface2, borderColor: c.border, color: c.text }}
          className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium"
        >
          AS
        </div>
      </div>
    </div>
  );
}