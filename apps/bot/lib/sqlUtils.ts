import { sql, type Column } from "drizzle-orm";

export function lower(col: Column) {
  return sql<string>`lower(${col})`;
}
