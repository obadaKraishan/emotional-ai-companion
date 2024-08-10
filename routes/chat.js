import express from 'express';
import Message from '../models/Message.js';
import { analyzeSentiment } from '../services/sentiment.js';
import { generateResponse } from '../services/ai.js'; // Import the AI response generator

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
    console.log('Received message:', req.body.text); // Debugging

    const newMessage = new Message(req.body);
    await newMessage.save();

    const sentiment = await analyzeSentiment(newMessage.text); // Analyze sentiment
    console.log('Sentiment analysis result:', sentiment); // Debugging

    const response = await generateResponse(newMessage.text, sentiment); // Await AI-generated response
    console.log('Generated response:', response); // Debugging

    res.status(201).json({ message: newMessage, response });
  } catch (err) {
    console.error('Error handling message:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
