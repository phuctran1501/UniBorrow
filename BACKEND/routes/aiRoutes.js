const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');

/**
 * @swagger
 * tags:
 *   name: AI Librarian
 *   description: API tương tác với AI hỗ trợ tìm sách
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Gửi tin nhắn cho AI Librarian
 *     tags: [AI Librarian]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               history:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Trả về câu trả lời từ AI
 */
router.post('/chat', chatWithAI);

module.exports = router;
