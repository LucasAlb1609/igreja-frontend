const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-backend-django.onrender.com'  // ← ATUALIZE DEPOIS
  : 'http://localhost:8000';

export default API_BASE_URL;