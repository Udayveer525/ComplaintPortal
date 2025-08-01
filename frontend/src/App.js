import React, { useState, useEffect } from 'react';

const API = '/api/complaints';

export default function App() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    name: '',
    room: '',
    issue_type: '',
    description: ''
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setComplaints(data.complaints);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', room: '', issue_type: '', description: '' });
    loadComplaints();
  };

  const markResolved = async (id) => {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
    loadComplaints();
  };

  const deleteComplaint = async (id) => {
    await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    loadComplaints();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <input id="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input id="room" placeholder="Room No." value={form.room} onChange={handleChange} required />
        <input id="issue_type" placeholder="Issue Type" value={form.issue_type} onChange={handleChange} required />
        <textarea id="description" placeholder="Describe the issue..." value={form.description} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      <hr />
      <h2>All Complaints</h2>
      {complaints.map(c => (
        <div key={c.id} className={`complaint ${c.status.toLowerCase()}`} style={{
          border: '1px solid #aaa',
          padding: '10px',
          margin: '10px 0',
          backgroundColor: c.status === 'Resolved' ? '#d4edda' : '#fff3cd'
        }}>
          <strong>{c.issue_type}</strong> from {c.name} (Room {c.room})<br />
          <small>{c.created_at}</small><br />
          <p>{c.description}</p>
          <p>Status: <b>{c.status}</b></p>
          {c.status === 'Pending' && <button onClick={() => markResolved(c.id)}>Mark Resolved</button>}
          <button onClick={() => deleteComplaint(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
