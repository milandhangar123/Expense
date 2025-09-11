// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-eo6k.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  TRANSACTIONS: {
    BASE: `${API_BASE_URL}/api/transactions`,
    BY_ID: (id) => `${API_BASE_URL}/api/transactions/${id}`,
  },
};

export default API_BASE_URL;
