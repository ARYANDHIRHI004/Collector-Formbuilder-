import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.js";

export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "published",
  "archived",
]);

export const forms = pgTable(
  "forms",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    status: formStatusEnum("status").default("draft").notNull(),
    description: text("description"),
    publishedVersionId: text("published_version_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("forms_user_id_idx").on(table.userId),
    index("forms_slug_idx").on(table.slug),
  ],
);

export const formVersions = pgTable(
  "form_versions",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    nodes: jsonb("nodes").notNull().$type<unknown[]>().default([]),
    edges: jsonb("edges").notNull().$type<unknown[]>().default([]),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("form_versions_form_id_idx").on(table.formId)],
);

export const submissions = pgTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    formVersionId: text("form_version_id")
      .notNull()
      .references(() => formVersions.id, { onDelete: "cascade" }),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  },
  (table) => [index("submissions_form_id_idx").on(table.formId)],
);

export const answers = pgTable(
  "answers",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    fieldId: text("field_id").notNull(),
    value: jsonb("value"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("answers_submission_id_idx").on(table.submissionId)],
);

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(user, {
    fields: [forms.userId],
    references: [user.id],
  }),
  versions: many(formVersions),
  submissions: many(submissions),
}));

export const formVersionsRelations = relations(formVersions, ({ one, many }) => ({
  form: one(forms, {
    fields: [formVersions.formId],
    references: [forms.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
  formVersion: one(formVersions, {
    fields: [submissions.formVersionId],
    references: [formVersions.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  submission: one(submissions, {
    fields: [answers.submissionId],
    references: [submissions.id],
  }),
}));
