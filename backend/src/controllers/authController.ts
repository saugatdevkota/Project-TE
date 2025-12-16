import { Request, Response } from 'express';
import { query } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { v4 as uuidv4 } from 'uuid';

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';

const generateTokens = (id: string, role: string) => {
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' }); // Short-lived
    const refreshToken = jwt.sign({ id, role }, REFRESH_SECRET, { expiresIn: '7d' }); // Long-lived
    return { accessToken, refreshToken };
};

const storeSession = async (userId: string, refreshToken: string, ip: string, userAgent: string) => {
    // Basic session handling: verify we don't spam db. 
    // Ideally we might clear old sessions or limit robustly, but for now simple insert.
    // Expires in 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const id = uuidv4();
    await query(
        `INSERT INTO auth_sessions (id, user_id, refresh_token, expires_at, ip_address, user_agent) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, userId, refreshToken, expiresAt, ip, userAgent]
    );
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

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

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await storeSession(user.id, refreshToken, String(ip), String(userAgent));

        // Set Refresh Token in Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ user, token: accessToken });
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

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        const ip = req.ip || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        await storeSession(user.id, refreshToken, String(ip), String(userAgent));

        // Set Refresh Token in Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_photo: user.profile_photo
            },
            token: accessToken
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { id } = req.user as { id: string }; // from authMiddleware
    const { name, profile_photo } = req.body;

    try {
        let queryStr = 'UPDATE users SET ';
        const params = [];
        let paramIndex = 1;

        if (name) {
            queryStr += `name = $${paramIndex}, `;
            params.push(name);
            paramIndex++;
        }
        if (profile_photo) {
            queryStr += `profile_photo = $${paramIndex}, `;
            params.push(profile_photo);
            paramIndex++;
        }

        // Remove trailing comma
        queryStr = queryStr.slice(0, -2);
        queryStr += ` WHERE id = $${paramIndex} RETURNING id, name, email, role, profile_photo`;
        params.push(id);

        const result = await query(queryStr, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    try {
        const decoded = jwt.verify(token, REFRESH_SECRET) as any;

        // Verify session in DB
        const sessionCheck = await query('SELECT * FROM auth_sessions WHERE refresh_token = $1 AND user_id = $2', [token, decoded.id]);
        if (sessionCheck.rows.length === 0) {
            // Token reuse detected or invalid?
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Token Rotation: Delete old session, Create new one
        await query('DELETE FROM auth_sessions WHERE refresh_token = $1', [token]);

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);
        const ip = req.ip || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        await storeSession(decoded.id, newRefreshToken, String(ip), String(userAgent));

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ token: accessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (token) {
        await query('DELETE FROM auth_sessions WHERE refresh_token = $1', [token]);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
