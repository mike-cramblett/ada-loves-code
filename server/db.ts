import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

// NEW (Works in both local dev and Cloud Run):
const DATA_DIR = process.env.DATA_DIR || (fs.existsSync('/mnt/data') ? '/mnt/data' : process.cwd());
const DB_FILE = path.join(DATA_DIR, 'hypebestie.sqlite');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('Could not load existing sqlite file, creating new database.', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create tables if not existing
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id TEXT PRIMARY KEY,
      patreon_id TEXT,
      is_patron INTEGER DEFAULT 0,
      credits_remaining INTEGER NOT NULL,
      last_refill_date TEXT NOT NULL
    );
  `);

  // Migrate existing tables if columns are missing
  try {
    const tableInfo = dbInstance.exec("PRAGMA table_info(user_credits)");
    if (tableInfo.length > 0 && tableInfo[0].values) {
      const existingColumns = tableInfo[0].values.map((col: any[]) => col[1]);
      const today = new Date().toISOString().slice(0, 10);

      if (!existingColumns.includes('patreon_id')) {
        dbInstance.run("ALTER TABLE user_credits ADD COLUMN patreon_id TEXT;");
      }
      if (!existingColumns.includes('is_patron')) {
        dbInstance.run("ALTER TABLE user_credits ADD COLUMN is_patron INTEGER DEFAULT 0;");
      }
      if (!existingColumns.includes('last_refill_date')) {
        dbInstance.run(`ALTER TABLE user_credits ADD COLUMN last_refill_date TEXT DEFAULT '${today}';`);
      }
    }
  } catch (migErr) {
    console.warn('Migration error check:', migErr);
  }

  saveDb();
  return dbInstance;
}

export function saveDb() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

export interface UserCreditInfo {
  creditsRemaining: number;
  maxCredits: number;
}

export const DAILY_SCAN_LIMIT = Number(process.env.INITIAL_FREE_CREDITS) || 25;

export async function getUserCreditInfo(userId: string): Promise<UserCreditInfo> {
  const db = await getDb();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const maxCredits = DAILY_SCAN_LIMIT;

  const stmt = db.prepare('SELECT * FROM user_credits WHERE user_id = $userId');
  stmt.bind({ '$userId': userId });

  if (stmt.step()) {
    const row: any = stmt.getAsObject();
    stmt.free();

    // If it's a new day or last_refill_date was empty/null, refill credits to daily quota (25)
    if (!row.last_refill_date || row.last_refill_date !== today) {
      db.run(
        'UPDATE user_credits SET credits_remaining = ?, last_refill_date = ? WHERE user_id = ?',
        [maxCredits, today, userId]
      );
      saveDb();
      return { creditsRemaining: maxCredits, maxCredits };
    }

    const creditsRemaining = typeof row.credits_remaining === 'number' ? row.credits_remaining : maxCredits;
    return { creditsRemaining, maxCredits };
  } else {
    stmt.free();
    const now = new Date().toISOString();
    db.run('INSERT OR IGNORE INTO users (id, created_at) VALUES (?, ?)', [userId, now]);
    db.run(
      'INSERT INTO user_credits (user_id, is_patron, credits_remaining, last_refill_date) VALUES (?, 0, ?, ?)',
      [userId, maxCredits, today]
    );
    saveDb();
    return { creditsRemaining: maxCredits, maxCredits };
  }
}

export async function getUserCredits(userId: string): Promise<number> {
  const info = await getUserCreditInfo(userId);
  return info.creditsRemaining;
}

export async function decrementUserCredits(userId: string): Promise<number> {
  const current = await getUserCredits(userId);
  if (current <= 0) {
    return 0;
  }
  const newCredits = current - 1;
  const db = await getDb();
  db.run('UPDATE user_credits SET credits_remaining = ? WHERE user_id = ?', [newCredits, userId]);
  saveDb();
  return newCredits;
}
