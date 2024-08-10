import express from 'express';
import Message from '../models/Message.js';
import { analyzeSentiment } from '../services/sentiment.js';
import { generateResponse } from '../services/ai.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Received message:', req.body.text);

    const newMessage = new Message(req.body);
    await newMessage.save();

    const sentiment = await analyzeSentiment(newMessage.text);
    console.log('Sentiment analysis result:', sentiment);

    const response = await generateResponse(newMessage.text); // Adjusted to match new function signature
    console.log('Generated response:', response);

    res.status(201).json({ message: newMessage, response });
  } catch (err) {
    console.error('Error handling message:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
