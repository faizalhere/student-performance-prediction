const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.details = data.details;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/api/health`);
    return handleResponse(res);
  },

  async predict(payload) {
    const res = await fetch(`${API_BASE}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async getMetrics() {
    const res = await fetch(`${API_BASE}/api/metrics`);
    return handleResponse(res);
  },

  async getHistory(search = '', sortBy = 'latest') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sortBy) params.append('sort', sortBy);
    const url = `${API_BASE}/api/history${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async deleteHistory(id) {
    const res = await fetch(`${API_BASE}/api/history/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async getDashboard() {
    const res = await fetch(`${API_BASE}/api/dashboard`);
    return handleResponse(res);
  },
};

export default api;
