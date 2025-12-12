import { Request, Response } from 'express';
import { query } from '../db';

export const getTutorProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(
            `SELECT t.*, u.name, u.email, u.profile_photo, u.country 
       FROM tutor_profiles t 
       JOIN users u ON t.tutor_id = u.id 
       WHERE t.tutor_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tutor profile not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateTutorProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bio, subjects, languages, hourly_rate, years_experience } = req.body;

    try {
        const result = await query(
            `UPDATE tutor_profiles 
       SET bio = $1, subjects = $2, languages = $3, hourly_rate = $4, years_experience = $5
       WHERE tutor_id = $6
       RETURNING *`,
            [bio, subjects, languages, hourly_rate, years_experience, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tutor profile not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const verifyTutor = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await query(
            `UPDATE tutor_profiles SET status = 'verified' WHERE tutor_id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tutor not found' });
        }
        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const uploadVerificationDocs = async (req: Request, res: Response) => {
    const { id } = req.params;
    // ... rest of existing function
    const { documentUrl } = req.body;
    try {
        const result = await query(
            `UPDATE tutor_profiles 
       SET qualification_docs = array_append(qualification_docs, $1), status = 'pending'
       WHERE tutor_id = $2
       RETURNING *`,
            [documentUrl, id]
        );

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getAllTutors = async (req: Request, res: Response) => {
    const { subject, maxPrice } = req.query;

    let sql = `
    SELECT t.*, u.name, u.profile_photo, u.country 
    FROM tutor_profiles t 
    JOIN users u ON t.tutor_id = u.id
    WHERE t.status = 'verified'
  `;

    const params: any[] = [];
    let paramCount = 1;

    if (subject) {
        sql += ` AND $${paramCount} = ANY(t.subjects)`;
        params.push(subject);
        paramCount++;
    }

    if (maxPrice) {
        sql += ` AND t.hourly_rate <= $${paramCount}`;
        params.push(maxPrice);
        paramCount++;
    }

    try {
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
