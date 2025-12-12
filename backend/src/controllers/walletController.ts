import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const getWallet = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;

    try {
        const result = await query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            // Create wallet if not exists
            const walletId = uuidv4();
            const newWallet = await query(
                'INSERT INTO wallets (id, user_id, balance) VALUES ($1, $2, 0.00) RETURNING *',
                [walletId, userId]
            );
            // Fallback for SQLite which might not support RETURNING * with the adapter perfectly in all versions
            // But let's assume adapter handles it or we query again
            if (!newWallet.rows[0]) {
                return res.json({ id: walletId, user_id: userId, balance: 0.00 });
            }
            return res.json(newWallet.rows[0]);
        }
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const addFunds = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    try {
        // Update balance
        // Note: In production we would use transactions
        await query(
            'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
            [amount, userId]
        );

        const updatedWallet = await query('SELECT * FROM wallets WHERE user_id = $1', [userId]);

        // Log transaction (Simulation)
        const txId = uuidv4();
        await query(
            `INSERT INTO transactions (id, wallet_id, amount, type, description, status, created_at)
             VALUES ($1, $2, $3, 'deposit', 'Added funds via Test Card', 'completed', datetime('now'))`,
            [txId, updatedWallet.rows[0].id, amount]
        );

        res.json(updatedWallet.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
