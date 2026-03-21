// Test backend connection
fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
})
  .then(res => res.json())
  .then(data => console.log('Backend response:', data))
  .catch(err => console.error('Connection error:', err));
