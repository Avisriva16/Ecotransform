// server/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000; // Choose a port different from React's default (3000)

// --- MIDDLEWARE ---
// Use CORS to allow requests from your React frontend
app.use(cors()); 
// Allows the server to parse incoming JSON data (e.g., from POST requests)
app.use(express.json()); 

// --- API ENDPOINT ---
// A simple GET route to test the connection
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});