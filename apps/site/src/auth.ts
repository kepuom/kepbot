import "server-only";
import { cookies } from "next/headers";
import { createJWT, validateJWT } from "oslo/jwt";
import { z } from "zod";
import { TimeSpan } from "oslo";

const payloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

export const AuthJWTName = "auth";
export const AuthJWTAlgo = "HS256";

function getAuthJWTSecret() {
  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET is not set");

  return new TextEncoder().encode(AUTH_SECRET);
}

export async function createAuthJWT({
  payload,
  expiresInSeconds,
}: {
  payload: z.infer<typeof payloadSchema>;
  expiresInSeconds?: number;
}) {
  const secret = getAuthJWTSecret();

  const JWT = await createJWT(AuthJWTAlgo, secret, payload, {
    expiresIn: expiresInSeconds ? new TimeSpan(expiresInSeconds, "s") : undefined,
  });

  return {
    value: JWT,
    name: AuthJWTName,
    algorithm: AuthJWTAlgo,
  } as const;
}

export async function validateAuthJWT(token: string) {
  const secret = getAuthJWTSecret();
  return await validateJWT(AuthJWTAlgo, secret, token);
}

export async function getUser() {
  const auth = cookies().get("auth");
  if (!auth) return null;

  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) throw new Error("AUTH_SECRET is not set");

  try {
    const JWT = await validateAuthJWT(auth.value);

    if (JWT.expiresAt && JWT.expiresAt < new Date()) throw new Error("JWT expired");
    console.log("getUser:", JWT.payload);
    return payloadSchema.parse(JWT.payload);
  } catch (error) {
    console.log("validate JWT error", error);
  }
}

export async function getAuthenticatedUser() {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
