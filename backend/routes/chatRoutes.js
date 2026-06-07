import express from 'express';
import { processChatMessage } from '../controllers/chatController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Giới hạn 20 tin nhắn mỗi phút từ 1 IP để chống spam API
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 20, 
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.'
});

router.post('/', chatLimiter, processChatMessage);

export default router;
