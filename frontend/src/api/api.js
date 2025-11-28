import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // Cambia a true si usas cookies httpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añade token automáticamente a las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo global de errores: si recibimos 401 forzamos logout (simple)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      // redirigir a login — no usar hooks aquí
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default api;