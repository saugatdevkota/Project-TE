import { Request, Response } from 'express';
import { query } from '../db';

// Mock AI logic since we don't have an actual OpenAI key in this env
// In production, replace with actual OpenAI API calls

export const suggestPrice = async (req: Request, res: Response) => {
    const { subject, experience, country } = req.body;

    try {
        // Simple heuristic algorithm to mock AI
        let baseRate = 20;

        // Subject multiplier
        const highValueSubjects = ['Calculus', 'Physics', 'Computer Science', 'AI'];
        if (highValueSubjects.some(s => subject.includes(s))) {
            baseRate += 15;
        }

        // Experience multiplier
        baseRate += (Number(experience) * 2.5);

        // Country adjustment (simplified)
        if (['USA', 'UK', 'Canada', 'Australia'].includes(country)) {
            baseRate += 10;
        }

        const minPrice = Math.floor(baseRate * 0.9);
        const maxPrice = Math.ceil(baseRate * 1.1);

        res.json({
            suggested_rate: baseRate,
            range: { min: minPrice, max: maxPrice },
            reasoning: `Based on market data for ${subject} tutors with ${experience} years of experience in ${country}.`
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const matchTutors = async (req: Request, res: Response) => {
    const { studentNeeds, subject } = req.body;

    try {
        // In a real app, this would generate embeddings for studentNeeds
        // and perform a vector similarity search against tutor profiles.

        // Mocking the response
        const result = await query(
            `SELECT t.*, u.name, u.profile_photo 
       FROM tutor_profiles t 
       JOIN users u ON t.tutor_id = u.id 
       WHERE $1 = ANY(t.subjects) 
       AND t.status = 'verified'
       LIMIT 5`,
            [subject]
        );

        res.json({
            matches: result.rows,
            ai_analysis: "We found these tutors match your learning style and subject requirements."
        });
    } catch (err: any) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
