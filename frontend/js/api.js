// ─── API Configuration ─────────────────────────────────────────
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://your-backend.onrender.com/api'; // Replace with your deployed backend URL

// ─── Token Management ─────────────────────────────────────────
const getToken = () => localStorage.getItem('pawpulse_token');
const getUser = () => JSON.parse(localStorage.getItem('pawpulse_user') || 'null');
const setAuth = (token, user) => {
  localStorage.setItem('pawpulse_token', token);
  localStorage.setItem('pawpulse_user', JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem('pawpulse_token');
  localStorage.removeItem('pawpulse_user');
};
const isLoggedIn = () => !!getToken();
const isAdmin = () => getUser()?.role === 'admin';

// ─── Fetch Wrapper ─────────────────────────────────────────────
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Auth API ─────────────────────────────────────────────────
const AuthAPI = {
  register: (data) => apiCall('/auth/register', 'POST', data),
  login: (data) => apiCall('/auth/login', 'POST', data),
  getMe: () => apiCall('/auth/me')
};

// ─── Pet API ──────────────────────────────────────────────────
const PetAPI = {
  getAll: () => apiCall('/pets'),
  getOne: (id) => apiCall(`/pets/${id}`),
  create: (data) => apiCall('/pets', 'POST', data),
  update: (id, data) => apiCall(`/pets/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/pets/${id}`, 'DELETE'),
  markVaccination: (petId, vacId) => apiCall(`/pets/${petId}/vaccinations/${vacId}`, 'PUT'),
  getLogs: (id) => apiCall(`/pets/${id}/logs`),
  addLog: (id, data) => apiCall(`/pets/${id}/logs`, 'POST', data),
  updateLog: (petId, logId, data) => apiCall(`/pets/${petId}/logs/${logId}`, 'PUT', data),
  deleteLog: (petId, logId) => apiCall(`/pets/${petId}/logs/${logId}`, 'DELETE'),
};

// ─── Health API ───────────────────────────────────────────────
const HealthAPI = {
  checkSymptoms: (data) => apiCall('/health/check', 'POST', data),
  getHistory: (petId) => apiCall(`/health/${petId}`),
};

// ─── Admin API ────────────────────────────────────────────────
const AdminAPI = {
  getStats: () => apiCall('/admin/stats'),
  getUsers: () => apiCall('/admin/users'),
  deleteUser: (id) => apiCall(`/admin/users/${id}`, 'DELETE'),
  getPets: () => apiCall('/admin/pets'),
  deletePet: (id) => apiCall(`/admin/pets/${id}`, 'DELETE'),
};

// ─── Route Guard ──────────────────────────────────────────────
const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
};

const requireAdmin = () => {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
};

// ─── Utility: Show Toast Notification ─────────────────────────
const showToast = (message, type = 'success') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
};

// ─── Format Date ──────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
