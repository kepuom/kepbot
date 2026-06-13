import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as responses from "./schema/responses.ts";

//* For the built in migrate function with DDL migrations we and drivers strongly encourage you to use single client connection.
const connection = await mysql.createConnection(process.env.DATABASE_URL as string);
const db = drizzle(connection, {
  schema: { ...responses },
  mode: "default",
});
// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => {
    console.log("Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migrations failed!", err);
    process.exit(1);
  });
