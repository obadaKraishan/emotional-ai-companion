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
    const authToken = localStorage.getItem('authToken');
  
    if (!authToken) {
      alert("You are not logged in. Redirecting to login page.");
      window.location.href = '/';
      return;
    }
  
    if (input.value) {
      const predictions = await toxicityModel.classify([input.value]);
      const toxic = predictions.some((prediction) => prediction.results[0].match);
  
      // Send the message to the server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ text: input.value }),
      });
  
      if (response.status === 401) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem('authToken');
        window.location.href = '/';
        return;
      }
  
      const responseData = await response.json();
  
      // Display the user's message
      const userItem = document.createElement('li');
      userItem.textContent = `You: ${input.value}`;
      document.getElementById('messages').appendChild(userItem);
  
      // Display the AI's response
      const aiItem = document.createElement('li');
      aiItem.textContent = `AI: ${responseData.response}`;
      document.getElementById('messages').appendChild(aiItem);
  
      speak(responseData.response); // Use text-to-speech for AI's response
      window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the chat
  
      input.value = ''; // Clear the input field
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
