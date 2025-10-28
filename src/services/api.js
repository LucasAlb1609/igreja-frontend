const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://igreja-backend-yh22.onrender.com'  // ← SUA URL REAL DO BACKEND
  : 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL); // Para debug
export default API_BASE_URL;
