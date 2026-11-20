import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('speakwrite_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('speakwrite_token');
        localStorage.removeItem('speakwrite_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  saveOnboarding: (data) => api.post('/auth/onboarding', data),
};

export const writingAPI = {
  getTopic: (category, difficulty) => api.post('/writing/topic', { category, difficulty }),
  submitWriting: (data) => api.post('/writing/submit', data),
  getHistory: (userId) => api.get(`/writing/history/${userId}`),
};

export const voiceAPI = {
  transcribe: (data) => api.post('/voice/transcribe', data),
  evaluate: (data) => api.post('/voice/evaluate', data),
  respond: (data) => api.post('/voice/respond', data),
  tts: (data) => api.post('/voice/tts', data, { responseType: 'blob' }),
  getHistory: (userId) => api.get(`/voice/history/${userId}`),
};

export const videoAPI = {
  evaluate: (data) => api.post('/video/evaluate', data),
  getHistory: (userId) => api.get(`/video/history/${userId}`),
};

export const progressAPI = {
  getSummary: () => api.get('/progress'),
  getHistory: () => api.get('/progress/history'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export default api;
