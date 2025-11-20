import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import tutorRoutes from './routes/tutorRoutes';
import bookingRoutes from './routes/bookingRoutes';
import chatRoutes from './routes/chatRoutes';
import extraRoutes from './routes/extraRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TutorEveryone API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', extraRoutes);

export { app };
