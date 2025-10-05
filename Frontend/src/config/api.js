// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' 
    ? 'http://localhost:8080/api' 
    : 'https://sigmagpt-2-9t8u.onrender.com/api');

export const BASE_URL = API_BASE_URL.replace('/api', '');
export default API_BASE_URL;