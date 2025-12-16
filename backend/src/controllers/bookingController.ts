import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createBooking = async (req: Request, res: Response) => {
    const { tutorId, studentId, sessionTime, type, price } = req.body;

    try {
        // 1. Check availability (Mock check)

        // 2. Check wallet balance
        const wallet = await query('SELECT balance FROM wallets WHERE user_id = $1', [studentId]);
        if (wallet.rows[0].balance < price) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // 3. Create Booking (Requested State)
        const bookingId = uuidv4();
        const booking = await query(
            `INSERT INTO bookings (id, tutor_id, student_id, session_time, type, price, status, escrow_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'requested', 'held')
       RETURNING *`,
            [bookingId, tutorId, studentId, sessionTime, type, price]
        );

        // 4. Create Escrow Record
        const escrowId = uuidv4();
        await query(
            `INSERT INTO escrow_accounts (id, booking_id, amount, status)
             VALUES ($1, $2, $3, 'held')`,
            [escrowId, bookingId, price]
        );

        // 5. Deduct from Student Wallet
        await query(
            `UPDATE wallets SET balance = balance - $1 WHERE user_id = $2`,
            [price, studentId]
        );

        // 6. Create Transaction Record
        const transactionId = uuidv4();
        await query(
            `INSERT INTO transactions (id, wallet_id, amount, type, status)
       VALUES ($1, $2, $3, 'payment', 'completed')`,
            [transactionId, studentId, price]
        );

        res.status(201).json(booking.rows[0] || { id: bookingId, status: 'requested' });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const respondToBooking = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const { id: userId } = req.user as { id: string };

    try {
        const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
        const booking = bookingRes.rows[0];

        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.tutor_id !== userId) return res.status(403).json({ message: 'Not authorized' });
        if (booking.status !== 'requested') return res.status(400).json({ message: 'Invalid booking state' });

        if (action === 'accept') {
            await query("UPDATE bookings SET status = 'scheduled' WHERE id = $1", [bookingId]);
            res.json({ message: 'Booking accepted' });
        } else if (action === 'reject') {
            // Refund Logic
            await query("UPDATE bookings SET status = 'rejected', escrow_status = 'refunded' WHERE id = $1", [bookingId]);
            await query("UPDATE escrow_accounts SET status = 'refunded' WHERE booking_id = $1", [bookingId]);

            // Return funds to student
            await query("UPDATE wallets SET balance = balance + $1 WHERE user_id = $2", [booking.price, booking.student_id]);

            // Transaction Record
            const txId = uuidv4();
            await query(
                `INSERT INTO transactions (id, wallet_id, amount, type, status)
             VALUES ($1, $2, $3, 'refund', 'completed')`,
                [txId, booking.student_id, booking.price]
            );

            res.json({ message: 'Booking rejected and funds refunded' });
        } else {
            res.status(400).json({ message: 'Invalid action' });
        }
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getMyBookings = async (req: Request, res: Response) => {
    // Use req.user from authMiddleware
    const { id: userId, role } = req.user as { id: string, role: string };

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
        const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
        const booking = bookingRes.rows[0];

        if (!booking || booking.status !== 'scheduled') {
            return res.status(400).json({ message: 'Invalid booking status' });
        }

        // Update status only. Funds remain in Escrow until explicit release or auto-timer.
        await query(
            `UPDATE bookings SET status = 'completed' WHERE id = $1`,
            [bookingId]
        );

        // Set auto-release date in escrow (24h from now)
        const releaseDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        await query(
            `UPDATE escrow_accounts SET release_date = $1 WHERE booking_id = $2`,
            [releaseDate, bookingId]
        );

        res.json({ message: 'Session completed. Funds will be released in 24 hours.' });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const releaseFunds = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    // In real app: check if caller is admin OR if 24h passed

    try {
        const bookingRes = await query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
        const booking = bookingRes.rows[0];

        if (!booking || booking.escrow_status !== 'held') {
            return res.status(400).json({ message: 'Funds already released or not held' });
        }

        await query("UPDATE bookings SET escrow_status = 'released' WHERE id = $1", [bookingId]);
        await query("UPDATE escrow_accounts SET status = 'released' WHERE booking_id = $1", [bookingId]);

        // Release to Tutor
        await query("UPDATE wallets SET balance = balance + $1 WHERE user_id = $2", [booking.price, booking.tutor_id]);

        // Log TX
        const txId = uuidv4();
        await query(
            `INSERT INTO transactions (id, wallet_id, amount, type, status)
             VALUES ($1, $2, $3, 'deposit', 'completed')`,
            [txId, booking.tutor_id, booking.price]
        );

        res.json({ message: 'Funds released successfully' });

    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
