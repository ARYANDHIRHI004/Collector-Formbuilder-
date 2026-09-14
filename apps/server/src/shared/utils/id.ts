import { randomUUID } from "node:crypto";

export function createId(): string {
  return randomUUID();
}

export function createSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = randomUUID().slice(0, 8);
  return base ? `${base}-${suffix}` : `form-${suffix}`;
}
