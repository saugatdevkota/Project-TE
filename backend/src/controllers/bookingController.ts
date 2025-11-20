import { Request, Response } from 'express';
import { query } from '../db';

export const createBooking = async (req: Request, res: Response) => {
    const { tutorId, studentId, sessionTime, type, price } = req.body;

    try {
        // 1. Check availability (Mock check)
        // In real app, check against tutor's calendar table

        // 2. Check wallet balance
        const wallet = await query('SELECT balance FROM wallets WHERE user_id = $1', [studentId]);
        if (wallet.rows[0].balance < price) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // 3. Create Booking
        const booking = await query(
            `INSERT INTO bookings (tutor_id, student_id, session_time, type, price, status, escrow_status)
       VALUES ($1, $2, $3, $4, $5, 'scheduled', 'held')
       RETURNING *`,
            [tutorId, studentId, sessionTime, type, price]
        );

        // 4. Deduct from Student Wallet
        await query(
            `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
            [price, studentId]
        );

        // 5. Create Transaction Record
        await query(
            `INSERT INTO transactions (wallet_id, amount, type, status)
       VALUES ($1, $2, 'payment', 'completed')`,
            [studentId, price]
        );

        res.status(201).json(booking.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    const { userId, role } = req.query; // In real app, get from req.user

    try {
        const column = role === 'tutor' ? 'tutor_id' : 'student_id';
        const result = await query(
            `SELECT b.*, 
              u.name as other_party_name, 
              u.profile_photo as other_party_photo
       FROM bookings b
       JOIN users u ON b.${role === 'tutor' ? 'student_id' : 'tutor_id'} = u.id
       WHERE b.${column} = $1
       ORDER BY session_time DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const completeSession = async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    try {
        // 1. Get booking
        const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
        const booking = bookingRes.rows[0];

        if (!booking || booking.status !== 'scheduled') {
            return res.status(400).json({ message: 'Invalid booking status' });
        }

        // 2. Update Booking Status
        await query(
            `UPDATE bookings SET status = 'completed', escrow_status = 'released' WHERE id = $1`,
            [bookingId]
        );

        // 3. Release Funds to Tutor (Platform fee logic would go here)
        await query(
            `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2`,
            [booking.price, booking.tutor_id]
        );

        // 4. Create Transaction Record for Tutor
        await query(
            `INSERT INTO transactions (wallet_id, amount, type, status)
       VALUES ($1, $2, 'deposit', 'completed')`,
            [booking.tutor_id, booking.price]
        );

        res.json({ message: 'Session completed and funds released' });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
