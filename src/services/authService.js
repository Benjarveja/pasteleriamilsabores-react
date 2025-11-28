import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';

const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  refresh: '/auth/refresh',
  me: '/users/me',
};

const persistAuthState = (response, profile) => {
  const { token, refreshToken, email, userId, roles } = response;
  const tokens = { token, refreshToken, email, userId, roles };
  tokenStorage.saveTokens(tokens);
  if (profile) {
    tokenStorage.saveSession(profile);
  }
  return tokens;
};

const formatProfile = (payload) => {
  if (!payload) return null;
  const { street, comuna, region } = payload;
  const address = [street, comuna, region].filter(Boolean).join(', ');
  return {
    ...payload,
    address,
  };
};

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(ENDPOINTS.login, { data: credentials });
    const profile = await apiClient.get(ENDPOINTS.me, { token: response.token });
    const normalizedProfile = formatProfile(profile);
    persistAuthState(response, normalizedProfile);
    return { tokens: response, profile: normalizedProfile };
  },
  register: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.register, { data: payload });
    const profile = await apiClient.get(ENDPOINTS.me, { token: response.token });
    const normalizedProfile = formatProfile(profile);
    persistAuthState(response, normalizedProfile);
    return { tokens: response, profile: normalizedProfile };
  },
  refresh: async () => {
    const stored = tokenStorage.getTokens();
    if (!stored?.refreshToken) {
      throw new Error('No hay token de refresco disponible.');
    }
    const response = await apiClient.post(ENDPOINTS.refresh, {
      data: { refreshToken: stored.refreshToken },
    });
    const profile = tokenStorage.getSession() ?? (await apiClient.get(ENDPOINTS.me, { token: response.token }));
    const normalizedProfile = formatProfile(profile);
    persistAuthState(response, normalizedProfile);
    return { tokens: response, profile: normalizedProfile };
  },
  fetchProfile: async (token) => {
    const profile = await apiClient.get(ENDPOINTS.me, { token });
    const normalizedProfile = formatProfile(profile);
    tokenStorage.saveSession(normalizedProfile);
    return normalizedProfile;
  },
};

