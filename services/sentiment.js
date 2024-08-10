// services/sentiment.js

import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  if (result.score > 0) {
    return 'positive';
  } else if (result.score < 0) {
    return 'negative';
  } else {
    return 'neutral';
  }
}
