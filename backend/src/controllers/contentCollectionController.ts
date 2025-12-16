import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const createCollection = async (req: Request, res: Response) => {
    const { tutorId, title, description, price, thumbnail_url, visibility, subject } = req.body;

    try {
        const id = uuidv4();
        const result = await query(
            `INSERT INTO content_collections (id, tutor_id, title, description, price, thumbnail_url, visibility, subject)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [id, tutorId, title, description, price, thumbnail_url, visibility, subject]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error("Create Collection Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getCollections = async (req: Request, res: Response) => {
    const { tutorId } = req.query;

    try {
        let sql = `SELECT * FROM content_collections WHERE 1=1`;
        const params: any[] = [];

        if (tutorId) {
            sql += ` AND tutor_id = $1`;
            params.push(tutorId);
        }

        sql += ` ORDER BY created_at DESC`;

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getCollectionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Get Collection Details
        const collectionResult = await query(`SELECT * FROM content_collections WHERE id = $1`, [id]);

        if (collectionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Get Items in Collection
        const itemsResult = await query(
            `SELECT * FROM content_hub WHERE collection_id = $1 ORDER BY created_at ASC`,
            [id]
        );

        res.json({
            ...collectionResult.rows[0],
            items: itemsResult.rows
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const updateCollection = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, price, visibility } = req.body;

    try {
        const result = await query(
            `UPDATE content_collections 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 price = COALESCE($3, price),
                 visibility = COALESCE($4, visibility)
             WHERE id = $5
             RETURNING *`,
            [title, description, price, visibility, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.json(result.rows[0]);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await query(`DELETE FROM content_collections WHERE id = $1`, [id]);
        res.json({ message: 'Collection deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
