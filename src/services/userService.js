import { apiClient } from './apiClient';

const BASE_PATH = '/users/me';

export const userService = {
  fetchProfile: (token) => apiClient.get(BASE_PATH, { token }),
  updateProfile: (token, data) => apiClient.put(BASE_PATH, { token, data }),
};
