import { router, protectedProcedure, publicProcedure } from "@workspace/trpc";
import { schema, type Db } from "@workspace/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { createId } from "../../shared/utils/id.js";
import { NotFoundError, BadRequestError } from "../../shared/utils/ApiError.js";

const { forms, formVersions, submissions, answers } = schema;

export const submissionRouter = router({
  create: publicProcedure
    .input(
      z.object({
        formSlug: z.string(),
        answers: z.array(
          z.object({
            fieldId: z.string(),
            value: z.unknown(),
          }),
        ),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db as Db;

      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.slug, input.formSlug), eq(forms.status, "published")))
        .limit(1);

      if (!form?.publishedVersionId) {
        throw new NotFoundError("Published form not found");
      }

      const [version] = await db
        .select()
        .from(formVersions)
        .where(eq(formVersions.id, form.publishedVersionId))
        .limit(1);

      if (!version) {
        throw new BadRequestError("Form has no published version");
      }

      const submissionId = createId();

      await db.insert(submissions).values({
        id: submissionId,
        formId: form.id,
        formVersionId: version.id,
        metadata: input.metadata ?? {},
      });

      if (input.answers.length > 0) {
        await db.insert(answers).values(
          input.answers.map((answer) => ({
            id: createId(),
            submissionId,
            fieldId: answer.fieldId,
            value: answer.value,
          })),
        );
      }

      return { submissionId };
    }),

  listByForm: protectedProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db as Db;

      const [form] = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, input.formId), eq(forms.userId, ctx.user.id)))
        .limit(1);

      if (!form) {
        throw new NotFoundError("Form not found");
      }

      const rows = await db
        .select({
          id: submissions.id,
          submittedAt: submissions.submittedAt,
          metadata: submissions.metadata,
        })
        .from(submissions)
        .where(eq(submissions.formId, input.formId))
        .orderBy(desc(submissions.submittedAt));

      const submissionIds = rows.map((row) => row.id);

      const allAnswers =
        submissionIds.length > 0
          ? await db
              .select()
              .from(answers)
              .where(inArray(answers.submissionId, submissionIds))
          : [];

      const answersBySubmission = new Map<string, typeof allAnswers>();
      for (const answer of allAnswers) {
        const existing = answersBySubmission.get(answer.submissionId) ?? [];
        existing.push(answer);
        answersBySubmission.set(answer.submissionId, existing);
      }

      return rows.map((row) => ({
        ...row,
        answers: answersBySubmission.get(row.id) ?? [],
      }));
    }),

  listRecent: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db as Db;

      return db
        .select({
          id: submissions.id,
          submittedAt: submissions.submittedAt,
          formId: submissions.formId,
          formName: forms.name,
        })
        .from(submissions)
        .innerJoin(forms, eq(submissions.formId, forms.id))
        .where(eq(forms.userId, ctx.user.id))
        .orderBy(desc(submissions.submittedAt))
        .limit(input.limit);
    }),
});
