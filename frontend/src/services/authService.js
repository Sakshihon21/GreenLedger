import api from './api';

/**
 * Authenticates user credentials against the GreenLedger API.
 * Calls POST /api/v1/auth/login
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Registers a new user account with specified role.
 * Calls POST /api/v1/auth/register
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Fetches current authenticated user profile.
 * Calls GET /api/v1/auth/me
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
