import { and, eq, isNull, or, sql } from "drizzle-orm";
import { type NonNullableFields } from "./types.ts";
import { db } from "./index.ts";
import { responses, type Response, type ResponseInsert } from "./schema/responses.ts";

export async function getUserResponses({
  userId,
  query,
}: Pick<Response, "userId"> & { query?: string }) {
  if (!query)
    return db.query.responses.findMany({
      where: eq(responses.userId, userId),
    });

  const q = `%${query}%`;
  return db.query.responses.findMany({
    where: and(
      eq(responses.userId, userId),
      sql`${responses.text} LIKE ${q} COLLATE utf8mb4_general_ci`,
    ),
  });
}

export async function getResponsesFromMessage({
  targetId,
  trigger,
}: NonNullableFields<Pick<Response, "targetId" | "trigger">>) {
  return db.query.responses.findMany({
    where: and(
      or(isNull(responses.targetId), eq(responses.targetId, targetId)),
      sql`${responses.trigger} LIKE ${trigger} COLLATE utf8mb4_general_ci`,
    ),
  });
}

export async function getResponsesFromMention({
  targetId,
}: NonNullableFields<Pick<Response, "targetId">>) {
  return db.query.responses.findMany({
    where: and(
      isNull(responses.trigger),
      or(isNull(responses.targetId), eq(responses.targetId, targetId)),
    ),
  });
}

export async function insertResponse(response: ResponseInsert) {
  return db.insert(responses).values(response);
}

export async function deleteResponse({ id, userId }: Pick<Response, "id" | "userId">) {
  return db.delete(responses).where(and(eq(responses.id, id), eq(responses.userId, userId)));
}
