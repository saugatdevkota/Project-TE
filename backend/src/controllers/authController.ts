import { Request, Response } from 'express';
import { query } from '../db';
// In a real app, use bcrypt for hashing and jsonwebtoken for tokens
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// Mocking these for now to ensure it runs without extra dependencies if they aren't installed
const hashPassword = (pwd: string) => pwd; // placeholder
const comparePassword = (pwd: string, hash: string) => pwd === hash; // placeholder
const generateToken = (id: string, role: string) => `mock_token_${id}_${role}`;

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = hashPassword(password);

        // Create user
        const newUser = await query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        const user = newUser.rows[0];

        // Create wallet
        await query('INSERT INTO wallets (user_id) VALUES ($1)', [user.id]);

        // If tutor, create profile
        if (role === 'tutor') {
            await query('INSERT INTO tutor_profiles (tutor_id) VALUES ($1)', [user.id]);
        }

        const token = generateToken(user.id, user.role);

        res.status(201).json({ user, token });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user.id, user.role);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo
            },
            token
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
