import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createOffer = async (req: Request, res: Response) => {
    const { tutorId, studentId, subject, price, sessionCount, description } = req.body;

    try {
        const offerId = uuidv4();

        // 1. Create Offer Record
        const offerResult = await query(
            `INSERT INTO offers (id, tutor_id, student_id, subject, price, session_count, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
             RETURNING *`,
            [offerId, tutorId, studentId, subject, price, sessionCount || 1]
        );
        const offer = offerResult.rows[0];

        // 2. Create Chat Message linking to this offer
        // metadata stores the snapshot of the offer for quick rendering
        const metadata = JSON.stringify({
            type: 'offer',
            offerId: offerId,
            price: price,
            subject: subject,
            sessionCount: sessionCount,
            status: 'pending'
        });

        const msgId = uuidv4();
        await query(
            `INSERT INTO messages (id, sender_id, receiver_id, content, msg_type, metadata, created_at)
             VALUES ($1, $2, $3, $4, 'offer', $5, NOW())`,
            [msgId, tutorId, studentId, description || 'I have sent you a custom offer.', metadata]
        );

        res.status(201).json({ offer, messageId: msgId });
    } catch (err: any) {
        console.error("Create Offer Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const respondToOffer = async (req: Request, res: Response) => {
    const { offerId } = req.params;
    const { status, studentId } = req.body; // status: 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // 1. Update Offer Status
        const offerResult = await query(
            `UPDATE offers SET status = $1 WHERE id = $2 RETURNING *`,
            [status, offerId]
        );

        if (offerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        const offer = offerResult.rows[0];

        // 2. Logic for Accepted Offer
        if (status === 'accepted') {
            // Create a Booking immediately
            const bookingId = uuidv4();
            await query(
                `INSERT INTO bookings (id, student_id, tutor_id, subject, price, status, created_at)
                 VALUES ($1, $2, $3, $4, $5, 'scheduled', NOW())`,
                [bookingId, studentId, offer.tutor_id, offer.subject, offer.price]
            );

            // Create Escrow Record (Holding funds)
            const escrowId = uuidv4();
            await query(
                `INSERT INTO escrow_accounts (id, booking_id, amount, status, created_at)
                 VALUES ($1, $2, $3, 'held', NOW())`,
                [escrowId, bookingId, offer.price]
            );

            // Deduct from Wallet? (Assuming we skip wallet deduction logic for this prototype or it's handled elsewhere)
            // For V2 prototype, we assume wallet has sufficient mock funds.
        }

        // 3. Update related Message Metadata to reflect new status
        // Find the message associated with this offer
        // Note: In a real app we might link by ID, here we search by metadata->>offerId or just post a new system message.
        // Let's post a system message confirming the action.
        const sysMsgId = uuidv4();
        const content = status === 'accepted' ? 'Offer accepted! Booking confirmed.' : 'Offer declined.';

        await query(
            `INSERT INTO messages (id, sender_id, receiver_id, content, msg_type, created_at)
             VALUES ($1, $2, $3, $4, 'system', NOW())`,
            [sysMsgId, studentId, offer.tutor_id, content] // Sent by student (responder) to tutor
        );

        res.json({ message: `Offer ${status}`, offer });
    } catch (err: any) {
        console.error("Respond Offer Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getOffers = async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
        const result = await query(
            `SELECT * FROM offers WHERE tutor_id = $1 OR student_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
