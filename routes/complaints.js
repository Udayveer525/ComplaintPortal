// routes/complaints.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');


// GET all complaints
router.get('/', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM complaints';
  let params = [];

  if (status) {
    sql += ' WHERE LOWER(status) = ?';
    params.push(status.toLowerCase());
  }

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const dayjs = require('dayjs');
    const utc = require('dayjs/plugin/utc');
    const tz = require('dayjs/plugin/timezone');
    dayjs.extend(utc);
    dayjs.extend(tz);

    rows = rows.map(row => ({
      ...row,
      created_at: dayjs.utc(row.created_at).tz('Asia/Kolkata').format('DD MMM YYYY, hh:mm A')
    }));

    res.json({ complaints: rows });
  });
});


// Post a new complaint
router.post('/', (req, res) => {
  const { name, room, issue_type, description } = req.body;

  if (!name.trim() || !room.trim() || !issue_type.trim()) {
    return res.status(400).json({ error: 'Fields must not be empty' });
}


  const sql = `
    INSERT INTO complaints (name, room, issue_type, description)
    VALUES (?, ?, ?, ?)
  `;
  const params = [name, room, issue_type, description];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Complaint submitted' });
  });
});


// Update a complaint status
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) return res.status(400).json({ error: 'Status is required' });

  const sql = `UPDATE complaints SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ message: 'Complaint status updated' });
  });
});


// Delete a complaint
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM complaints WHERE id = ?`;

  db.run(sql, [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  });
});


module.exports = router;




/*
For testing

{
  "name": "Udayveer",
  "room": "B3-101",
  "issue_type": "Water",
  "description": "No water supply since morning"
}

*/
