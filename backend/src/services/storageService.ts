import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

// Configuration
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'local'; // 'local' | 's3' | 'r2'

// Interface for Upload Result
interface UploadResult {
    url: string;
    key: string; // S3 Key or Filename
    provider: string;
}

// Local Storage Setup
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Engines
const localStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Export Multer Middleware
export const uploadMiddleware = multer({
    storage: localStorageEngine, // For now, we use local storage for multer temp files before S3 upload (or direct)
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});


// Service Functions
export const uploadFile = async (file: Express.Multer.File): Promise<UploadResult> => {
    if (STORAGE_PROVIDER === 'local') {
        const filename = file.filename;
        const url = `${process.env.API_URL || 'http://localhost:5000'}/uploads/${filename}`;
        return { url, key: filename, provider: 'local' };
    }

    // Stub for S3/R2
    if (STORAGE_PROVIDER === 's3' || STORAGE_PROVIDER === 'r2') {
        // Here we would use aws-sdk / @aws-sdk/client-s3 
        // const s3 = new S3Client({...});
        // await s3.send(new PutObjectCommand({...}));
        console.log('S3 Upload logic placeholder');

        // Mock return
        return {
            url: `https://my-bucket.s3.amazonaws.com/${file.filename}`,
            key: file.filename,
            provider: 's3'
        };
    }

    throw new Error(`Unknown Storage Provider: ${STORAGE_PROVIDER}`);
};

export const deleteFile = async (key: string, provider: string = 'local') => {
    if (provider === 'local') {
        const filePath = path.join(uploadDir, key);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } else {
        console.log(`Mock deleting ${key} from ${provider}`);
    }
};
