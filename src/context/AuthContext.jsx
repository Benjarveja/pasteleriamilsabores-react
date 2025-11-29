import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { tokenStorage } from '../services/tokenStorage';

const AuthContext = createContext();

const composeAddress = ({ street, comuna, region }) =>
  [street, comuna, region].filter(Boolean).join(', ');

const toProfile = (payload) => {
  if (!payload) return null;
  return {
    ...payload,
    address: payload.address ?? composeAddress(payload),
  };
};

const POLLING_INTERVAL_MS = 20000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => toProfile(tokenStorage.getSession()));
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [ordersStatus, setOrdersStatus] = useState('idle');
  const [ordersError, setOrdersError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [initializingError, setInitializingError] = useState(null);

  const [pollingEnabled, setPollingEnabled] = useState(false);

  useEffect(() => {
    const bootstrapSession = async () => {
      const stored = tokenStorage.getTokens();
      if (!stored?.token) {
        setInitialized(true);
        return;
      }
      try {
        setStatus('loading');
        const profile = await fetchProfile();
        if (profile) {
          await loadOrders(stored.token);
          setStatus('authenticated');
          setPollingEnabled(true);
        } else {
          setStatus('idle');
        }
        setInitializingError(null);
      } catch (error) {
        setInitializingError(error.message || 'No pudimos restaurar tu sesión.');
        logout();
        setStatus('idle');
      } finally {
        setInitialized(true);
      }
    };
    bootstrapSession();
  }, []);

  useEffect(() => {
    if (!pollingEnabled) return undefined;
    const interval = setInterval(async () => {
      try {
        await ensureOrdersLoaded();
      } catch (err) {
        console.warn('Failed to refresh orders', err);
      }
    }, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [pollingEnabled]);

  const ensureOrdersLoaded = async () => {
    const stored = tokenStorage.getTokens();
    if (!stored?.token) {
      setOrders([]);
      return [];
    }
    return loadOrders(stored.token);
  };

  const persistSession = (profile) => {
    setUser(profile);
    if (profile) {
      tokenStorage.saveSession(profile);
    } else {
      tokenStorage.clearSession();
    }
  };

  const handleAuthSuccess = ({ profile }) => {
    const formatted = toProfile(profile);
    persistSession(formatted);
    return formatted;
  };

  const login = async (credentials) => {
    setStatus('auth-loading');
    setError(null);
    try {
      const response = await authService.login(credentials);
      const profile = handleAuthSuccess(response);
      await loadOrders(response.tokens.token);
      setStatus('authenticated');
      setPollingEnabled(true);
      return profile;
    } catch (err) {
      setStatus('error');
      setError(err.message || 'No pudimos iniciar sesión.');
      throw err;
    }
  };

  const register = async (payload) => {
    setStatus('register-loading');
    setError(null);
    try {
      const response = await authService.register(payload);
      const profile = handleAuthSuccess(response);
      setStatus('authenticated');
      setPollingEnabled(true);
      return profile;
    } catch (err) {
      setStatus('error');
      setError(err.message || 'No pudimos registrar tu cuenta.');
      throw err;
    }
  };

  const refreshSession = async () => {
    try {
      setStatus('refreshing');
      const response = await authService.refresh();
      const profile = handleAuthSuccess(response);
      setStatus('authenticated');
      setPollingEnabled(true);
      return profile;
    } catch (err) {
      logout();
      setStatus('idle');
      setPollingEnabled(false);
      throw err;
    }
  };

  const fetchProfile = async () => {
    const stored = tokenStorage.getTokens();
    if (!stored?.token) return null;
    const remoteProfile = await userService.fetchProfile(stored.token);
    const formatted = toProfile(remoteProfile);
    persistSession(formatted);
    return formatted;
  };

  const logout = () => {
    tokenStorage.clearAll();
    setOrders([]);
    persistSession(null);
    setPollingEnabled(false);
  };

  const updateProfile = async (updates) => {
    const stored = tokenStorage.getTokens();
    if (!stored?.token) {
      throw new Error('No hay sesión activa.');
    }
    const profile = await userService.updateProfile(stored.token, updates);
    const formatted = toProfile(profile);
    persistSession(formatted);
    return formatted;
  };

  const loadOrders = async (tokenOverride) => {
    const stored = tokenOverride ? { token: tokenOverride } : tokenStorage.getTokens();
    if (!stored?.token) {
      setOrders([]);
      return [];
    }
    setOrdersStatus('loading');
    setOrdersError(null);
    try {
      const fetched = await orderService.getMyOrders(stored.token);
      setOrders(fetched ?? []);
      setOrdersStatus('loaded');
      return fetched;
    } catch (err) {
      setOrdersError(err.message || 'No pudimos cargar tus pedidos.');
      setOrdersStatus('error');
      throw err;
    }
  };

  const refreshOrders = async () => ensureOrdersLoaded();

  const addOrder = async () => {
    const stored = tokenStorage.getTokens();
    if (stored?.token) {
      await loadOrders(stored.token);
      setPollingEnabled(true);
    }
  };

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      orders,
      ordersStatus,
      ordersError,
      initialized,
      initializingError,
      login,
      register,
      refreshSession,
      fetchProfile,
      logout,
      updateProfile,
      loadOrders,
      ensureOrdersLoaded,
      refreshOrders,
      addOrder,
    }),
    [
      user,
      status,
      error,
      orders,
      ordersStatus,
      ordersError,
      initialized,
      initializingError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }
  return context;
};
