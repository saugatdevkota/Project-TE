import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

export const captureSnapshot = async (req: Request, res: Response) => {
    try {
        // 1. Calculate stats per subject
        // Group by subject, ignore null subjects
        const stats = await query(`
            SELECT 
                subject,
                COUNT(*) as tutor_count,
                AVG(hourly_rate) as avg_rate,
                MIN(hourly_rate) as min_rate,
                MAX(hourly_rate) as max_rate
            FROM tutor_profiles
            WHERE subject IS NOT NULL
            GROUP BY subject
        `);

        // 2. Store Snapshot
        const snapshotId = uuidv4();
        const timestamp = new Date();

        // We'll store individual rows for each subject in 'pricing_snapshots'
        // or a single JSON blob if the table design allows. 
        // Based on typical schema, let's look at what we defined. 
        // If we didn't define a strict schema yet, we'll assume a 'pricing_snapshots' table exists
        // with fields: id, subject, avg_rate, min_rate, max_rate, created_at

        // Let's insert each subject stats as a row
        for (const row of stats.rows) {
            await query(
                `INSERT INTO pricing_snapshots (id, subject, market_rate_avg, suggested_price_min, suggested_price_max, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [uuidv4(), row.subject, row.avg_rate, row.min_rate, row.max_rate, timestamp]
            );
        }

        res.json({ message: 'Market pricing snapshot captured', data: stats.rows });

    } catch (err: any) {
        console.error("Capture Snapshot Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getMarketRates = async (req: Request, res: Response) => {
    const { subject } = req.query;

    try {
        let sql = `
            SELECT subject, market_rate_avg, suggested_price_min, suggested_price_max, created_at
            FROM pricing_snapshots
            WHERE 1=1
        `;
        const params: any[] = [];

        if (subject) {
            sql += ` AND subject = $1`;
            params.push(subject);
        }

        // Get only the latest snapshot for each subject
        // This is a bit complex in SQL, simpler approach:
        // Just order by created_at DESC and limit if subject is specific

        if (subject) {
            sql += ` ORDER BY created_at DESC LIMIT 1`;
        } else {
            // If no subject, we might want latest for ALL subjects.
            // For prototype, let's just return the last 50 entries
            sql += ` ORDER BY created_at DESC LIMIT 50`;
        }

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
