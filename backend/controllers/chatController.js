import asyncHandler from 'express-async-handler';
import { handleChatWithGemini } from '../services/ai/geminiService.js';

// @desc    Xử lý tin nhắn chatbot và trả về luồng SSE (Server-Sent Events)
// @route   POST /api/chat
// @access  Public
export const processChatMessage = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400);
    throw new Error('Định dạng tin nhắn không hợp lệ');
  }

  // Set headers for Server-Sent Events (SSE)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no' // Prevent Nginx buffering if deployed
  });

  // Giao việc xử lý giao tiếp và stream cho geminiService
  await handleChatWithGemini(messages, res);
});
