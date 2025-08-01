// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create DB file if not exists
const db = new sqlite3.Database(path.resolve(__dirname, 'complaints.db'), (err) => {
  if (err) {
    console.error('❌ Error opening database', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      room TEXT NOT NULL,
      issue_type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Table creation failed:', err.message);
    else console.log('✅ Complaints table ready');
  });
});

module.exports = db;
