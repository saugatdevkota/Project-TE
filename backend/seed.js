"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const localDb_1 = require("./src/localDb"); // Using localDb directly for SQLite
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from the backend directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '.env') });
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🌱 Starting Database Seed...');
    try {
        // 1. Clear existing data (optional, but good for cleanliness)
        yield (0, localDb_1.query)('DELETE FROM reviews');
        yield (0, localDb_1.query)('DELETE FROM bookings');
        yield (0, localDb_1.query)('DELETE FROM tutor_profiles');
        yield (0, localDb_1.query)('DELETE FROM wallets');
        yield (0, localDb_1.query)('DELETE FROM users');
        console.log('🧹 Cleared existing data.');
        // 2. Create Password Hash
        const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
        // 3. Define Tutor Data
        const tutors = [
            { name: 'Dr. Sarah Wilson', email: 'sarah@example.com', subject: 'Mathematics', rate: 45, bio: 'PhD in Mathematics with 10 years of teaching experience.' },
            { name: 'James Rodriguez', email: 'james@example.com', subject: 'Spanish', rate: 30, bio: 'Native Spanish speaker passionate about conversational fluency.' },
            { name: 'Emily Chen', email: 'emily@example.com', subject: 'Piano', rate: 60, bio: 'Concert pianist offering lessons for all skill levels.' },
            { name: 'Michael Chang', email: 'michael@example.com', subject: 'Computer Science', rate: 55, bio: 'Senior Software Engineer at Tech Giant teaching Python & React.' },
            { name: 'Jessica Taylor', email: 'jessica@example.com', subject: 'English', rate: 35, bio: 'Certified ESL teacher specializing in business English.' },
            { name: 'David Kim', email: 'david@example.com', subject: 'Physics', rate: 50, bio: 'Making Physics easy and fun for high school students.' },
            { name: 'Sophie Martin', email: 'sophie@example.com', subject: 'French', rate: 40, bio: 'Sorbonne graduate teaching French literature and language.' },
            { name: 'Robert Johnson', email: 'robert@example.com', subject: 'Chemistry', rate: 45, bio: 'Chemistry expert helping you ace your AP exams.' },
            { name: 'Alice Walker', email: 'alice@example.com', subject: 'Art & Design', rate: 35, bio: 'Professional illustrator teaching digital art and sketching.' },
            { name: 'Tom Baker', email: 'tom@example.com', subject: 'History', rate: 30, bio: 'Specializing in World History and European politics.' }
        ];
        // 4. Insert Tutors
        for (const t of tutors) {
            const userId = (0, uuid_1.v4)();
            // Insert User
            yield (0, localDb_1.query)(`INSERT INTO users (id, name, email, password, role, is_verified, created_at)
                 VALUES ($1, $2, $3, $4, 'tutor', TRUE, datetime('now'))`, [userId, t.name, t.email, hashedPassword]);
            // Insert Wallet
            yield (0, localDb_1.query)(`INSERT INTO wallets (id, user_id, balance) VALUES ($1, $2, 0.00)`, [(0, uuid_1.v4)(), userId]);
            // Insert Tutor Profile
            yield (0, localDb_1.query)(`INSERT INTO tutor_profiles (id, tutor_id, bio, hourly_rate, subjects, languages, status, rating)
                 VALUES ($1, $2, $3, $4, $5, $6, 'verified', 5.0)`, [
                (0, uuid_1.v4)(),
                userId,
                t.bio,
                t.rate,
                JSON.stringify([t.subject]), // Store as JSON array string for text column
                JSON.stringify(['English']),
            ]);
        }
        console.log(`✅ Seeded ${tutors.length} Tutors.`);
        // 5. Insert Students
        const students = ['Student One', 'Student Two', 'Student Three'];
        for (const s of students) {
            const userId = (0, uuid_1.v4)();
            yield (0, localDb_1.query)(`INSERT INTO users (id, name, email, password, role, is_verified, created_at)
                 VALUES ($1, $2, $3, $4, 'student', TRUE, datetime('now'))`, [userId, s, `${s.replace(' ', '').toLowerCase()}@example.com`, hashedPassword]);
            yield (0, localDb_1.query)(`INSERT INTO wallets (id, user_id, balance) VALUES ($1, $2, 100.00)`, [(0, uuid_1.v4)(), userId]);
        }
        console.log(`✅ Seeded ${students.length} Students.`);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    process.exit();
});
seedDatabase();
