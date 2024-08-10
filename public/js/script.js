let toxicityModel;
toxicity.load().then((model) => {
  toxicityModel = model;
});

const socket = io();

document.addEventListener('DOMContentLoaded', function () {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  }
});

// Register User
document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const response = await fetch('/api/user/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    showFeedback('Registration successful', true);
    localStorage.setItem('authToken', data.token);
    window.location.href = '/';
  } else {
    showFeedback(`Registration failed: ${data.error}`, false);
  }
});

// Login User
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('authToken', data.token);
    window.location.href = '/';
  } else {
    showFeedback(`Login failed: ${data.error}`, false);
  }
});

// Handle Chat Submission
document.getElementById('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.getElementById('input');
  if (input.value) {
    const predictions = await toxicityModel.classify([input.value]);
    const toxic = predictions.some((prediction) => prediction.results[0].match);

    if (toxic) {
      socket.emit('chat message', 'Please refrain from using offensive language.');
    } else {
      socket.emit('chat message', input.value);
    }
    input.value = '';
  }
});

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  document.getElementById('messages').appendChild(item);
  speak(msg);
  window.scrollTo(0, document.body.scrollHeight);
});

function showFeedback(message, success) {
  const modalBody = document.getElementById('feedbackModalBody');
  modalBody.textContent = message;
  const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
  modal.show();
}
