const API = '/api/complaints';

const form = document.getElementById('complaintForm');
const complaintsDiv = document.getElementById('complaints');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: form.name.value,
    room: form.room.value,
    issue_type: form.issue_type.value,
    description: form.description.value
  };

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  form.reset();
  loadComplaints();
});

async function loadComplaints() {
  const res = await fetch(API);
  const { complaints } = await res.json();

  complaintsDiv.innerHTML = complaints.map(c => `
    <div class="complaint ${c.status.toLowerCase()}">
      <strong>${c.issue_type}</strong> from ${c.name} (Room ${c.room})<br>
      <small>${c.created_at}</small><br>
      <p>${c.description}</p>
      <p>Status: <b>${c.status}</b></p>
      ${c.status === 'Pending' ? `<button onclick="markResolved(${c.id})">Mark Resolved</button>` : ''}
      <button onclick="deleteComplaint(${c.id})">Delete</button>
    </div>
  `).join('');
}

async function markResolved(id) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Resolved' })
  });

  loadComplaints();
}

async function deleteComplaint(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  loadComplaints();
}

loadComplaints();
