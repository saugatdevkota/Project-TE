import { Request, Response } from 'express';
import { query } from '../db';

export const getConversations = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Get list of unique users the current user has chatted with
        // This is a simplified query. In production, you'd want a separate 'conversations' table for performance.
        const result = await query(
            `SELECT DISTINCT ON (other_user_id)
         CASE 
           WHEN sender_id = $1 THEN receiver_id 
           ELSE sender_id 
         END as other_user_id,
         u.name, u.profile_photo,
         m.text as last_message, m.timestamp
       FROM messages m
       JOIN users u ON (
         CASE 
           WHEN m.sender_id = $1 THEN m.receiver_id 
           ELSE m.sender_id 
         END = u.id
       )
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY other_user_id, timestamp DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const { userId, otherId } = req.params;

    try {
        const result = await query(
            `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
            [userId, otherId]
        );

        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const saveMessage = async (senderId: string, receiverId: string, text: string) => {
    try {
        const result = await query(
            `INSERT INTO messages (sender_id, receiver_id, text) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
            [senderId, receiverId, text]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error saving message:', err);
        return null;
    }
};
