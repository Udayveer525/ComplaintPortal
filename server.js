const express = require('express');
const path = require('path');
const db = require('./db/database');
const complaintsRouter = require('./routes/complaints');

const app = express();

// Middleware
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/complaints', complaintsRouter);

// Force homepage route to serve index.html (for GET /)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

