const API_URL = 'https://freelance-ys0n.onrender.com/api';

const headers = { 'Content-Type': 'application/json' };

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  const data = contentType && contentType.includes('application/json')
    ? await res.json()
    : { message: `Server error (${res.status})` };
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    sessionStorage.setItem('isLoggedIn', 'true');
    return data;
  },

  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', headers });
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  },

  // Clients
  getClients: () => fetch(`${API_URL}/clients`, { headers }).then(handleResponse),
  createClient: (data) => fetch(`${API_URL}/clients`, { method: 'POST', headers, body: JSON.stringify(data) }).then(handleResponse),
  updateClient: (id, data) => fetch(`${API_URL}/clients/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(handleResponse),
  deleteClient: (id) => fetch(`${API_URL}/clients/${id}`, { method: 'DELETE', headers }).then(handleResponse),

  // Projects
  getProjects: () => fetch(`${API_URL}/projects`, { headers }).then(handleResponse),
  createProject: (data) => fetch(`${API_URL}/projects`, { method: 'POST', headers, body: JSON.stringify(data) }).then(handleResponse),
  updateProject: (id, data) => fetch(`${API_URL}/projects/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(handleResponse),
  deleteProject: (id) => fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers }).then(handleResponse),

  // Tasks
  getTasks: () => fetch(`${API_URL}/tasks`, { headers }).then(handleResponse),
  createTask: (data) => fetch(`${API_URL}/tasks`, { method: 'POST', headers, body: JSON.stringify(data) }).then(handleResponse),
  updateTask: (id, data) => fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(handleResponse),
  deleteTask: (id) => fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers }).then(handleResponse),

  // Payments
  getPayments: () => fetch(`${API_URL}/payments`, { headers }).then(handleResponse),
  createPayment: (data) => fetch(`${API_URL}/payments`, { method: 'POST', headers, body: JSON.stringify(data) }).then(handleResponse),
  updatePayment: (id, data) => fetch(`${API_URL}/payments/${id}`, { method: 'PUT', headers, body: JSON.stringify(data) }).then(handleResponse),
  deletePayment: (id) => fetch(`${API_URL}/payments/${id}`, { method: 'DELETE', headers }).then(handleResponse),
};
