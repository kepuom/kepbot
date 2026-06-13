import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as responses from "./schema/responses.ts";

const DATABASE_URL = process.env.DATABASE_URL as string;

async function getConnection() {
  const connection = mysql.createPool({
    enableKeepAlive: true,
    maxIdle: 0,
    idleTimeout: 60000,
    uri: DATABASE_URL,
  });

  const db = drizzle(connection, {
    schema: { ...responses },
    mode: "default",
  });
  return db;
}

export const db = await getConnection();
