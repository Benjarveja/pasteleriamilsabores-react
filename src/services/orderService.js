import { apiClient } from './apiClient';

const BASE_PATH = '/orders';

export const orderService = {
  async getMyOrders(token) {
    if (!token) return [];
    return apiClient.get(`${BASE_PATH}/me`, { token });
  },

  async getById(orderId, token) {
    if (!token) throw new Error('No hay sesión activa.');
    return apiClient.get(`${BASE_PATH}/${orderId}`, { token });
  },
};
