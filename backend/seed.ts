import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query } from './src/localDb'; // Using localDb directly for SQLite
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const seedDatabase = async () => {
    console.log('🌱 Starting Database Seed...');

    try {
        // 1. Clear existing data (optional, but good for cleanliness)
        await query('DELETE FROM reviews');
        await query('DELETE FROM bookings');
        await query('DELETE FROM tutor_profiles');
        await query('DELETE FROM wallets');
        await query('DELETE FROM users');
        console.log('🧹 Cleared existing data.');

        // 2. Create Password Hash
        const hashedPassword = await bcrypt.hash('password123', 10);

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
            const userId = uuidv4();
            // Insert User
            await query(
                `INSERT INTO users (id, name, email, password, role, is_verified, created_at)
                 VALUES ($1, $2, $3, $4, 'tutor', TRUE, datetime('now'))`,
                [userId, t.name, t.email, hashedPassword]
            );

            // Insert Wallet
            await query(
                `INSERT INTO wallets (id, user_id, balance) VALUES ($1, $2, 0.00)`,
                [uuidv4(), userId]
            );

            // Insert Tutor Profile
            await query(
                `INSERT INTO tutor_profiles (id, tutor_id, bio, hourly_rate, subjects, languages, status, rating)
                 VALUES ($1, $2, $3, $4, $5, $6, 'verified', 5.0)`,
                [
                    uuidv4(),
                    userId,
                    t.bio,
                    t.rate,
                    JSON.stringify([t.subject]), // Store as JSON array string for text column
                    JSON.stringify(['English']),
                ]
            );
        }
        console.log(`✅ Seeded ${tutors.length} Tutors.`);

        // 5. Insert Students
        const students = ['Student One', 'Student Two', 'Student Three'];
        for (const s of students) {
            const userId = uuidv4();
            await query(
                `INSERT INTO users (id, name, email, password, role, is_verified, created_at)
                 VALUES ($1, $2, $3, $4, 'student', TRUE, datetime('now'))`,
                [userId, s, `${s.replace(' ', '').toLowerCase()}@example.com`, hashedPassword]
            );
            await query(
                `INSERT INTO wallets (id, user_id, balance) VALUES ($1, $2, 100.00)`,
                [uuidv4(), userId]
            );
        }
        console.log(`✅ Seeded ${students.length} Students.`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
    process.exit();
};

seedDatabase();
