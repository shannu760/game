import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'nexora.db'));

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    display_name TEXT UNIQUE NOT NULL,
    avatar TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    game_type TEXT NOT NULL,
    is_private BOOLEAN DEFAULT 0,
    room_code TEXT UNIQUE,
    max_players INTEGER DEFAULT 8,
    status TEXT DEFAULT 'waiting',
    created_by TEXT,
    FOREIGN KEY(created_by) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS room_members (
    room_id TEXT,
    profile_id TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, profile_id),
    FOREIGN KEY(room_id) REFERENCES rooms(id),
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    room_id TEXT,
    winner_id TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY(room_id) REFERENCES rooms(id),
    FOREIGN KEY(winner_id) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS match_results (
    match_id TEXT,
    profile_id TEXT,
    reaction_time REAL,
    rank INTEGER,
    xp_earned INTEGER,
    PRIMARY KEY (match_id, profile_id),
    FOREIGN KEY(match_id) REFERENCES matches(id),
    FOREIGN KEY(profile_id) REFERENCES profiles(id)
  );
`);

export default db;
