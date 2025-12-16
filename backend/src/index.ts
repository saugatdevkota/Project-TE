import { app } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { saveMessage } from './controllers/chatController';

dotenv.config();

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    });

    socket.on('send_message', async (data) => {
        const { senderId, receiverId, text, attachments } = data;

        // Save to DB
        const savedMessage = await saveMessage(senderId, receiverId, text, attachments);

        if (savedMessage) {
            // Emit to receiver
            io.to(receiverId).emit('receive_message', savedMessage);
            // Emit back to sender (for confirmation/optimistic UI updates if needed)
            io.to(senderId).emit('message_sent', savedMessage);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
