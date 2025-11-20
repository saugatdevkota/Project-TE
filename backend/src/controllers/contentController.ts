import { Request, Response } from 'express';
import { query } from '../db';

export const createContent = async (req: Request, res: Response) => {
    const { tutorId, title, description, type, price, fileUrl, visibility } = req.body;

    try {
        const result = await query(
            `INSERT INTO content_hub (tutor_id, title, description, type, price, file_url, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [tutorId, title, description, type, price, fileUrl, visibility]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getContent = async (req: Request, res: Response) => {
    const { tutorId } = req.query;

    try {
        let sql = `
      SELECT c.*, u.name as tutor_name 
      FROM content_hub c
      JOIN users u ON c.tutor_id = u.id
      WHERE c.visibility = 'public'
    `;

        const params: any[] = [];

        if (tutorId) {
            sql += ` AND c.tutor_id = $1`;
            params.push(tutorId);
        }

        sql += ` ORDER BY c.id DESC`;

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
