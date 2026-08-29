import Database from "better-sqlite3";

export const db = new Database("chinook.db");

export function getDatabaseSchema() {
  const tables = db
    .prepare(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `)
    .all();

  const schema = {};

  for (const table of tables) {
    const columns = db
      .prepare(`PRAGMA table_info(${table.name});`)
      .all();

    schema[table.name] = columns.map(col => ({
      name: col.name,
      type: col.type
    }));
  }

  return schema;
}

function normalizeType(type) {
  if (!type) return "TEXT";
  const t = type.toUpperCase();
  if (t.includes("INT")) return "INTEGER";
  if (t.includes("CHAR") || t.includes("TEXT") || t.includes("CLOB") || t.includes("DATE") || t.includes("TIME")) return "TEXT";
  if (t.includes("REAL") || t.includes("FLOA") || t.includes("DOUB") || t.includes("NUM") || t.includes("DEC")) return "REAL";
  return "TEXT";
}

export function schemaToPrompt(schema) {
  let text = "";

  for (const table in schema) {
    text += `CREATE TABLE ${table} ( `;
    text += schema[table]
      .map(col => `${col.name} ${normalizeType(col.type)}`)
      .join(", ");
    text += ` );\n`;
  }

  return text;
}

export function cleanAndFixSQL(rawSql) {
  if (!rawSql || typeof rawSql !== 'string') return "";

  let sql = rawSql.replace(/```sql|```/gi, '').trim();

  // SQLite interprets "string" as column names in some contexts; convert double quotes to single quotes
  sql = sql.replace(/"([^"]+)"/g, "'$1'");

  // Remove any trailing semicolon for consistency
  sql = sql.replace(/;+$/, '').trim();

  return sql;
}

// --- SAFETY CHECKS ---
export function validateSQL(sql) {
  if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
    throw new Error("Invalid SQL: Query is empty");
  }

  const trimmed = sql.trim().toLowerCase();

  // 1. Strictly require starting with SELECT
  if (!trimmed.startsWith("select")) {
    throw new Error("Security check failed: Only SELECT queries are allowed");
  }

  // 2. Reject destructive/altering keywords
  const forbidden = /\b(insert|update|delete|drop|alter|create|replace|truncate|pragma|attach|detach|grant|revoke)\b/i;
  if (forbidden.test(trimmed)) {
    throw new Error("Security check failed: Modifying statements are strictly forbidden");
  }

  // 3. Block multi-statement execution (; separator injection)
  if (sql.includes(";") && sql.trim().indexOf(";") !== sql.trim().length - 1) {
    throw new Error("Security check failed: Multiple SQL statements are not permitted");
  }
}

export function runQuery(sql) {
  validateSQL(sql); 
  const stmt = db.prepare(sql);
  return stmt.all();
}

