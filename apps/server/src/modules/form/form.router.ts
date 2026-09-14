import { router, protectedProcedure, publicProcedure } from "@workspace/trpc";
import { schema, type Db } from "@workspace/db";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createId, createSlug } from "../../shared/utils/id.js";
import { NotFoundError } from "../../shared/utils/ApiError.js";

const { forms, formVersions, submissions } = schema;

const formNodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.unknown()),
});

const formEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
});

async function getOwnedForm(db: Db, formId: string, userId: string) {
  const [form] = await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .limit(1);

  if (!form) {
    throw new NotFoundError("Form not found");
  }

  return form;
}

async function getLatestVersion(db: Db, formId: string) {
  const [version] = await db
    .select()
    .from(formVersions)
    .where(eq(formVersions.formId, formId))
    .orderBy(desc(formVersions.version))
    .limit(1);

  return version ?? null;
}

export const formRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db as Db;
      const formId = createId();
      const versionId = createId();

      await db.insert(forms).values({
        id: formId,
        userId: ctx.user.id,
        name: input.name,
        slug: createSlug(input.name),
        description: input.description,
        status: "draft",
      });

      await db.insert(formVersions).values({
        id: versionId,
        formId,
        version: 1,
        nodes: [],
        edges: [],
        settings: {},
      });

      return { id: formId, versionId };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const db = ctx.db as Db;

    const userForms = await db
      .select({
        id: forms.id,
        name: forms.name,
        slug: forms.slug,
        status: forms.status,
        description: forms.description,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        responseCount: count(submissions.id),
      })
      .from(forms)
      .leftJoin(submissions, eq(submissions.formId, forms.id))
      .where(eq(forms.userId, ctx.user.id))
      .groupBy(forms.id)
      .orderBy(desc(forms.updatedAt));

    return userForms;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db as Db;
      const form = await getOwnedForm(db, input.id, ctx.user.id);
      const version = await getLatestVersion(db, form.id);

      return { form, version };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(1000).optional(),
        nodes: z.array(formNodeSchema).optional(),
        edges: z.array(formEdgeSchema).optional(),
        settings: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db as Db;
      const form = await getOwnedForm(db, input.id, ctx.user.id);

      if (input.name || input.description !== undefined) {
        await db
          .update(forms)
          .set({
            ...(input.name ? { name: input.name } : {}),
            ...(input.description !== undefined
              ? { description: input.description }
              : {}),
          })
          .where(eq(forms.id, form.id));
      }

      const hasGraphUpdate =
        input.nodes !== undefined ||
        input.edges !== undefined ||
        input.settings !== undefined;

      if (hasGraphUpdate) {
        const latestVersion = await getLatestVersion(db, form.id);

        if (latestVersion && !latestVersion.publishedAt) {
          await db
            .update(formVersions)
            .set({
              ...(input.nodes !== undefined ? { nodes: input.nodes } : {}),
              ...(input.edges !== undefined ? { edges: input.edges } : {}),
              ...(input.settings !== undefined ? { settings: input.settings } : {}),
            })
            .where(eq(formVersions.id, latestVersion.id));
        } else {
          const nextVersion = (latestVersion?.version ?? 0) + 1;
          await db.insert(formVersions).values({
            id: createId(),
            formId: form.id,
            version: nextVersion,
            nodes: input.nodes ?? latestVersion?.nodes ?? [],
            edges: input.edges ?? latestVersion?.edges ?? [],
            settings: input.settings ?? latestVersion?.settings ?? {},
          });
        }
      }

      return { success: true };
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db as Db;
      const form = await getOwnedForm(db, input.id, ctx.user.id);
      const latestVersion = await getLatestVersion(db, form.id);

      if (!latestVersion) {
        throw new NotFoundError("No form version to publish");
      }

      let publishedVersionId = latestVersion.id;

      if (latestVersion.publishedAt) {
        const versionId = createId();
        const nextVersion = latestVersion.version + 1;

        await db.insert(formVersions).values({
          id: versionId,
          formId: form.id,
          version: nextVersion,
          nodes: latestVersion.nodes,
          edges: latestVersion.edges,
          settings: latestVersion.settings ?? {},
          publishedAt: new Date(),
        });

        publishedVersionId = versionId;
      } else {
        await db
          .update(formVersions)
          .set({ publishedAt: new Date() })
          .where(eq(formVersions.id, latestVersion.id));
      }

      await db
        .update(forms)
        .set({
          status: "published",
          publishedVersionId,
        })
        .where(eq(forms.id, form.id));

      return { publishedVersionId };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db as Db;
      await getOwnedForm(db, input.id, ctx.user.id);

      await db.delete(forms).where(eq(forms.id, input.id));

      return { success: true };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db as Db;

      
      
      const [form] = await db
      .select()
      .from(forms)
      .where(and(eq(forms.slug, input.slug), eq(forms.status, "published")))
      .limit(1);

      console.log(form);

      if (!form || !form.publishedVersionId) {
        throw new NotFoundError("Published form not found");
      }

      const [version] = await db
        .select()
        .from(formVersions)
        .where(eq(formVersions.id, form.publishedVersionId))
        .limit(1);

      if (!version) {
        throw new NotFoundError("Published form version not found");
      }

      return {
        id: form.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        nodes: version.nodes,
        edges: version.edges,
        settings: version.settings,
      };
    }),

  dashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const db = ctx.db as Db;

    const [stats] = await db
      .select({
        totalForms: count(forms.id),
        publishedForms: sql<number>`count(*) filter (where ${forms.status} = 'published')`,
        totalResponses: count(submissions.id),
      })
      .from(forms)
      .leftJoin(submissions, eq(submissions.formId, forms.id))
      .where(eq(forms.userId, ctx.user.id));

    return {
      totalForms: stats?.totalForms ?? 0,
      publishedForms: Number(stats?.publishedForms ?? 0),
      totalResponses: stats?.totalResponses ?? 0,
    };
  }),
});
