import { defineConfig } from "drizzle-kit";

export default defineConfig({
  verbose: true,
  strict: true,
  driver: "mysql2",
  schema: "./src/db/schema",
  out: "./src/db/drizzle",
  dbCredentials: {
    uri: process.env.DATABASE_URL as string,
  },
});
