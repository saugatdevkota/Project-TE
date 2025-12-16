import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createContent = async (req: Request, res: Response) => {
    const { tutorId, title, description, type, price, fileUrl, visibility, subject, grade_level, collection_id } = req.body;

    try {
        const cid = uuidv4();
        const result = await query(
            `INSERT INTO content_hub (id, tutor_id, title, description, type, price, file_url, visibility, subject, grade_level, collection_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
            [cid, tutorId, title, description, type, price, fileUrl, visibility, subject, grade_level, collection_id]
        );

        res.status(201).json(result.rows[0] || { id: cid });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getContent = async (req: Request, res: Response) => {
    const { tutorId, subject, grade_level, search, type } = req.query;

    try {
        let sql = `
      SELECT c.*, u.name as tutor_name 
      FROM content_hub c
      JOIN users u ON c.tutor_id = u.id
      WHERE c.visibility = 'public'
    `;

        const params: any[] = [];
        let paramCount = 1;

        if (tutorId) {
            sql += ` AND c.tutor_id = $${paramCount}`;
            params.push(tutorId);
            paramCount++;
        }

        if (subject && subject !== 'All Subjects') {
            sql += ` AND c.subject = $${paramCount}`;
            params.push(subject);
            paramCount++;
        }

        if (grade_level && grade_level !== 'All Grades') {
            sql += ` AND c.grade_level = $${paramCount}`;
            params.push(grade_level);
            paramCount++;
        }

        if (type && type !== 'All Types') {
            sql += ` AND c.type = $${paramCount}`;
            params.push(type);
            paramCount++;
        }

        if (search) {
            sql += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        sql += ` ORDER BY c.id DESC`;

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
