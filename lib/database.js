import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { seedCatalog } from "./catalog-seed";
import { assert, validateCatalog } from "./commerce";

export function databasePath() { return resolve(/* turbopackIgnore: true */ process.env.SPADONI_DB_PATH || ".data/spadoni.sqlite"); }
export function setupKeyPath() { return resolve(/* turbopackIgnore: true */ dirname(databasePath()), "admin-setup.key"); }
export function database() {
  const path = databasePath();
  const databases = globalThis.__spadoniDatabases ??= new Map();
  if (databases.has(path)) return databases.get(path);
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path, { timeout: 5000 });
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS catalog (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, document TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer','admin')), phone TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '{}', favorites TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, status TEXT NOT NULL, payment_status TEXT NOT NULL, document TEXT NOT NULL, idempotency_key TEXT UNIQUE NOT NULL);
    CREATE INDEX IF NOT EXISTS orders_user ON orders(user_id, created_at);
    CREATE TABLE IF NOT EXISTS auth_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
  `);
  db.prepare("INSERT OR IGNORE INTO catalog VALUES (1,1,?)").run(JSON.stringify(seedCatalog()));
  databases.set(path, db);
  // The initial administrator can only be created with this one-time local key.
  if (!process.env.ADMIN_SETUP_TOKEN && !existsSync(setupKeyPath()) && !db.prepare("SELECT id FROM users WHERE role='admin'").get()) {
    try { writeFileSync(setupKeyPath(), randomBytes(32).toString("base64url"), { flag: "wx", mode: 0o600 }); } catch (e) { if (e.code !== "EEXIST") throw e; }
  }
  return db;
}
export function transaction(callback) {
  const db = database(); db.exec("BEGIN IMMEDIATE");
  try { const result = callback(db); db.exec("COMMIT"); return result; } catch (error) { db.exec("ROLLBACK"); throw error; }
}
export function getCatalog() { const row = database().prepare("SELECT * FROM catalog WHERE id=1").get(); return { ...JSON.parse(row.document), revision: row.revision }; }
export function saveCatalog(input) {
  const clean = validateCatalog(input);
  return transaction(db => {
    const row = db.prepare("SELECT revision FROM catalog WHERE id=1").get();
    assert(row.revision === clean.revision, "O cardápio foi alterado em outra sessão. Recarregue antes de salvar.", 409);
    clean.revision = row.revision + 1;
    db.prepare("UPDATE catalog SET revision=?,document=? WHERE id=1").run(clean.revision, JSON.stringify(clean));
    return clean;
  });
}
