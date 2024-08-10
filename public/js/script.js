import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';
import * as toxicity from '@tensorflow-models/toxicity';

let toxicityModel;
toxicity.load().then(model => {
  toxicityModel = model;
});

const socket = io();

document.getElementById('form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const input = document.getElementById('input');
  if (input.value) {
    const predictions = await toxicityModel.classify([input.value]);
    const toxic = predictions.some(prediction => prediction.results[0].match);
    
    if (toxic) {
      socket.emit('chat message', 'Please refrain from using offensive language.');
    } else {
      socket.emit('chat message', input.value);
    }
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  document.getElementById('messages').appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
