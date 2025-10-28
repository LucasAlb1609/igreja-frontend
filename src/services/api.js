const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://igreja-backend-yh22.onrender.com'  // ← ATUALIZE DEPOIS
  : 'http://localhost:8000';


export default API_BASE_URL;
