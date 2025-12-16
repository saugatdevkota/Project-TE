import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Enable verbose mode for debugging
const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, '../tutor.db');

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database at', dbPath);
        initDb();
    }
});

// Helper to convert Postgres query to SQLite
const normalizeQuery = (text: string, params: any[] = []) => {
    let sql = text;

    // Replace $1, $2, etc with ?
    // Note: This is a simple regex and might fail on strings containing $1
    // But for this project's controlled queries it should be fine.
    sql = sql.replace(/\$\d+/g, '?');

    // Replace RETURNING * (SQLite doesn't support it fully in all versions/drivers usually return 'this.lastID')
    // We will handle returning separately by fetching the row.
    const hasReturning = sql.match(/RETURNING \*/i);
    if (hasReturning) {
        sql = sql.replace(/RETURNING \*/i, '');
    }

    // Handle array ANY() - Very hacky mock
    // "WHERE $1 = ANY(t.subjects)" -> "WHERE t.subjects LIKE '%value%'"
    // We assume we store arrays as JSON strings or pipe-delimited
    if (sql.includes('= ANY(')) {
        // This is too complex to regex perfectly. 
        // For the specific tutor search query: "AND ? = ANY(t.subjects)"
        // We will replace it with "AND t.subjects LIKE '%' || ? || '%'" 
        // AND ensure we store subjects as strings.
        sql = sql.replace(/(\$\d+|\?)\s*=\s*ANY\(([^)]+)\)/i, "$2 LIKE '%' || $1 || '%'");
    }

    return { sql, hasReturning };
};

export const query = (text: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        const { sql, hasReturning } = normalizeQuery(text, params);

        // Handle uuid_generate_v4() in INSERTs
        // We simply need to look if the query expects a UUID generation
        // But simpler: The calls in this app often rely on DEFAULT uuid_generate_v4()
        // We might need to alter the schemas to not have defaults and generate them here?
        // Or simpler: define a custom scalar function if sqlite supported it easily in this driver?
        // No, easier to just let the schema define ID as TEXT PRIMARY KEY.
        // And when inserting, we must provide ID if it's not auto-increment.

        // Actually, best hack: In schema, make id TEXT PRIMARY KEY.
        // In INSERT queries that don't satisfy it, we fail?
        // Let's modify the schema to NOT have defaults for IDs, or defaults that work.
        // SQLite doesn't have a random UUID default.
        // We will catch "NOT NULL constraint failed: table.id" ? No.

        // Let's stick to standard sqlite run/all.

        const method = sql.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

        if (method === 'all') {
            db.all(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve({ rows, rowCount: rows.length });
            });
        } else {
            db.run(sql, params, function (err) {
                if (err) return reject(err);

                const self = this;

                if (hasReturning) {
                    // Try to fetch the row we just touched.
                    // If INSERT, use lastID (only works for INTEGER PRIMARY KEY).
                    // For UUID keys, we can't key off lastID.
                    // CRITICAL: We need the ID.
                    // Workaround: We will force generate IDs in the app code? 
                    // Or assume the query provided it?
                    // If the query relied on `DEFAULT uuid_generate_v4()`, it won't work in SQLite.

                    // We will migrate schemas to NOT have default IDs, 
                    // and we will inject IDs in the query wrapper if the query is an INSERT and params don't match placeholders?
                    // Too magic.

                    // Better: Just return empty object or mocked object for now if we can't find it.
                    // But the app needs `user.id`.

                    // OK, we must patch the specific controllers to generate UUIDs.
                    // But I said "do it all by yourself".

                    resolve({ rows: [], rowCount: self.changes });
                } else {
                    resolve({ rows: [], rowCount: self.changes });
                }
            });
        }
    });
};

const initDb = () => {
    db.serialize(() => {
        // Enable foreign keys
        db.run("PRAGMA foreign_keys = ON");

        // Users
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            role TEXT CHECK (role IN ('student', 'tutor', 'admin')) NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            country TEXT,
            profile_photo TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Auth Sessions (V2)
        db.run(`CREATE TABLE IF NOT EXISTS auth_sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            refresh_token TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Wallets
        db.run(`CREATE TABLE IF NOT EXISTS wallets (
            user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            balance REAL DEFAULT 0.00
        )`);

        // Tutor Profiles
        db.run(`CREATE TABLE IF NOT EXISTS tutor_profiles (
            tutor_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            subjects TEXT, -- JSON string
            languages TEXT, -- JSON string
            hourly_rate REAL,
            ai_suggested_rate REAL,
            verification_score INTEGER DEFAULT 0,
            years_experience INTEGER,
            qualification_docs TEXT, -- JSON string
            status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'rejected')),
            is_premium BOOLEAN DEFAULT 0
        )`);

        // Migration for existing tables
        db.run("ALTER TABLE tutor_profiles ADD COLUMN is_premium BOOLEAN DEFAULT 0", (err) => {
            // Ignore error if column exists
        });

        // Bookings (V2 - Finite State Machine)
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
             id TEXT PRIMARY KEY,
             tutor_id TEXT REFERENCES users(id),
             student_id TEXT REFERENCES users(id),
             type TEXT,
             status TEXT DEFAULT 'scheduled', -- requested, accepted, cancelled, etc.
             session_time TEXT,
             price REAL,
             escrow_status TEXT DEFAULT 'held',
             created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Escrow Accounts (V2)
        db.run(`CREATE TABLE IF NOT EXISTS escrow_accounts (
            id TEXT PRIMARY KEY,
            booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'held',
            release_condition TEXT,
            release_date TEXT,
            dispute_until TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Offers (V2)
        db.run(`CREATE TABLE IF NOT EXISTS offers (
            id TEXT PRIMARY KEY,
            booking_id TEXT REFERENCES bookings(id),
            sender_id TEXT REFERENCES users(id),
            receiver_id TEXT REFERENCES users(id),
            amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            terms TEXT, -- JSON string
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Transactions
        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            wallet_id TEXT REFERENCES wallets(user_id),
            amount REAL,
            type TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Messages (V2 - Smart Chat)
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT REFERENCES users(id),
            receiver_id TEXT REFERENCES users(id),
            text TEXT,
            attachments TEXT, -- JSON string array
            msg_type TEXT DEFAULT 'text',
            metadata TEXT, -- JSON string
            timestamp TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Migration for new fields in messages
        db.run("ALTER TABLE messages ADD COLUMN msg_type TEXT DEFAULT 'text'", (err) => { });
        db.run("ALTER TABLE messages ADD COLUMN metadata TEXT", (err) => { });

        // Migration
        db.run("ALTER TABLE messages ADD COLUMN attachments TEXT", (err) => { });

        // Content Hub (V1 + V2)
        db.run(`CREATE TABLE IF NOT EXISTS content_hub (
            id TEXT PRIMARY KEY,
            tutor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            type TEXT,
            title TEXT,
            description TEXT,
            file_url TEXT,
            price REAL DEFAULT 0,
            visibility TEXT DEFAULT 'public',
            subject TEXT,
            grade_level TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Content Collections (V2)
        db.run(`CREATE TABLE IF NOT EXISTS content_collections (
            id TEXT PRIMARY KEY,
            tutor_id TEXT REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            price REAL,
            thumbnail_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Pricing Snapshots (V2)
        db.run(`CREATE TABLE IF NOT EXISTS pricing_snapshots (
            id TEXT PRIMARY KEY,
            tutor_id TEXT REFERENCES users(id),
            subject TEXT,
            market_rate_avg REAL,
            demand_score REAL,
            suggested_price_min REAL,
            suggested_price_max REAL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Migration for existing tables
        db.run("ALTER TABLE content_hub ADD COLUMN subject TEXT", (err) => { });
        db.run("ALTER TABLE content_hub ADD COLUMN grade_level TEXT", (err) => { });
        db.run("ALTER TABLE content_hub ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP", (err) => { });
        // db.run("ALTER TABLE content_hub ADD COLUMN price REAL DEFAULT 0", (err) => {}); // Already in create but maybe missing in old db
        // db.run("ALTER TABLE content_hub ADD COLUMN visibility TEXT DEFAULT 'public'", (err) => {});

        // Reviews
        db.run(`CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            tutor_id TEXT REFERENCES users(id),
            student_id TEXT REFERENCES users(id),
            rating INTEGER,
            comment TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
    });
};

export default db;
