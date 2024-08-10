import express from 'express';
import Message from '../models/Message.js';
import { analyzeSentiment } from '../services/sentiment.js'; // Example service for sentiment analysis

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
  
      const response = generateResponse(newMessage.text, sentiment); // Generate response based on sentiment
      console.log('Generated response:', response); // Debugging
  
      res.status(201).json({ message: newMessage, response });
    } catch (err) {
      console.error('Error handling message:', err);
      res.status(500).json({ error: err.message });
    }
  });
  

function generateResponse(userMessage, sentiment) {
  if (sentiment === 'negative') {
    return "I'm here for you. What's making you feel this way?";
  } else if (sentiment === 'positive') {
    return "That's great to hear! What made you happy today?";
  } else if (userMessage.toLowerCase().includes('angry')) {
    return "It's okay to feel angry sometimes. Want to talk about it?";
  } else {
    return "Tell me more about that.";
  }
}

export default router;
