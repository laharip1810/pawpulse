// ─── API Configuration ─────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';// 🔥 replace with your real backend URL

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

// ─── Fetch Wrapper (FIXED) ─────────────────────────────────────
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    const text = await response.text(); // 👈 get raw response safely

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("❌ Non-JSON response:", text);
      throw new Error("Server error: Invalid response (check backend)");
    }

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;

  } catch (error) {
    console.error("❌ API Error:", error);
    throw new Error(error.message || 'Network error');
  }
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
    window.location.href = 'frontend/pages/login.html';
    return false;
  }
  return true;
};

const requireAdmin = () => {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = 'frontend/pages/login.html';
    return false;
  }
  return true;
};

// ─── Toast Notification ───────────────────────────────────────
const showToast = (message, type = 'success') => {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ─── Utility ──────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const daysUntil = (dateStr) => {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};