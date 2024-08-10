import express from 'express';
import Message from '../models/Message.js';

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
    const newMessage = new Message(req.body);
    await newMessage.save();

    const response = generateResponse(newMessage.text);
    res.status(201).json({ message: newMessage, response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateResponse(userMessage) {
  // Basic sentiment analysis could be integrated here.
  if (userMessage.toLowerCase().includes('sad')) {
    return "I'm here for you. What's making you feel this way?";
  } else if (userMessage.toLowerCase().includes('happy')) {
    return "That's great to hear! What made you happy today?";
  } else if (userMessage.toLowerCase().includes('angry')) {
    return "It's okay to feel angry sometimes. Want to talk about it?";
  } else {
    return "Tell me more about that.";
  }
}

export default router;
