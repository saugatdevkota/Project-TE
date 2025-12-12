import { Request, Response } from 'express';
import { query } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { v4 as uuidv4 } from 'uuid';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '1d'
    });
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUserId = uuidv4();

        // Create user
        const newUser = await query(
            'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [newUserId, name, email, hashedPassword, role]
        );

        // SQLite might not return rows on INSERT (depending on our hack), so utilize the ID we generated
        const user = newUser.rows[0] || { id: newUserId, name, email, role };

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
        const isMatch = await bcrypt.compare(password, user.password_hash);

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
