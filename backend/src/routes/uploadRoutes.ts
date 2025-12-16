import { Router, Request, Response } from 'express';
import { uploadMiddleware, uploadFile } from '../services/storageService';

const router = Router();

// Route: Use middleware from storageService
router.post('/', uploadMiddleware.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to provider (Local or S3/R2)
        const result = await uploadFile(req.file);

        res.json({
            message: 'File uploaded successfully',
            url: result.url,
            filename: result.key,
            provider: result.provider
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

export default router;
