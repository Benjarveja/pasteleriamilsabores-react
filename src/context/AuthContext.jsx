import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();
const STORAGE_KEY = 'milSaboresUsers';
const SESSION_KEY = 'milSaboresSession';
const ORDERS_KEY = 'milSaboresOrders';

const composeFullAddress = ({ street, comuna, region }) =>
  [street, comuna, region].filter(Boolean).join(', ');

const normalizeUser = (candidate) => {
  if (!candidate) return candidate;
  const street = candidate.street ?? candidate.address ?? '';
  const region = candidate.region ?? '';
  const comuna = candidate.comuna ?? '';
  const birthDate = candidate.birthDate ?? '';
  const address = composeFullAddress({ street, comuna, region }) || candidate.address || '';

  return {
    ...candidate,
    street,
    region,
    comuna,
    address,
    birthDate,
  };
};

const TEST_USER = {
  id: 'demo-user',
  email: 'cliente@milsabores.cl',
  password: 'MilSabores123',
  firstName: 'Fernanda',
  lastName: 'Donoso',
  run: '12.345.678-5',
  phone: '987654321',
  birthDate: '1970-03-21',
  region: 'Región Metropolitana de Santiago',
  comuna: 'Providencia',
  street: 'Av. Siempre Viva 742, Depto 45',
  address: 'Av. Siempre Viva 742, Depto 45, Providencia, Región Metropolitana de Santiago',
};

const DEFAULT_ORDERS = [
  {
    id: 'order-20250712',
    userId: 'demo-user',
    number: 'MS-1027',
    placedAt: '2025-07-12T15:30:00-04:00',
    deliveryMethod: 'Retiro en tienda',
    status: 'Entregado',
    paymentMethod: 'Tarjeta de crédito',
    total: 28990,
    items: [
      { codigo: 'TC001', nombre: 'Torta Tres Leches', cantidad: 1, precio: 18990 },
      { codigo: 'PV001', nombre: 'Pie de Maracuyá', cantidad: 1, precio: 10000 },
    ],
  },
  {
    id: 'order-20250802',
    userId: 'demo-user',
    number: 'MS-1042',
    placedAt: '2025-08-02T11:10:00-04:00',
    deliveryMethod: 'Delivery programado',
    status: 'En preparación',
    paymentMethod: 'Transferencia bancaria',
    total: 36980,
    items: [
      { codigo: 'TT001', nombre: 'Torta de Chocolate Amargo', cantidad: 1, precio: 24990 },
      { codigo: 'TE001', nombre: 'Té de frutos rojos (blend)', cantidad: 2, precio: 5995 },
    ],
  },
];

const loadUsers = () => {
  if (typeof window === 'undefined') return [normalizeUser(TEST_USER)];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [normalizeUser(TEST_USER)];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [normalizeUser(TEST_USER)];
    }
    const normalized = parsed.map(normalizeUser);
    const hasDemo = parsed.some((user) => user.id === TEST_USER.id);
    return hasDemo ? normalized : [normalizeUser(TEST_USER), ...normalized];
  } catch (error) {
    console.error('Error loading users from storage', error);
    return [normalizeUser(TEST_USER)];
  }
};

const loadSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    return stored ? normalizeUser(JSON.parse(stored)) : null;
  } catch (error) {
    console.error('Error loading session from storage', error);
    return null;
  }
};

const loadOrders = () => {
  if (typeof window === 'undefined') return DEFAULT_ORDERS;
  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    if (!stored) {
      return DEFAULT_ORDERS;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return DEFAULT_ORDERS;
    }
    return parsed.length > 0 ? parsed : DEFAULT_ORDERS;
  } catch (error) {
    console.error('Error loading orders from storage', error);
    return DEFAULT_ORDERS;
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadUsers);
  const [user, setUser] = useState(loadSession);
  const [orders, setOrders] = useState(loadOrders);

  const persistUsers = (nextUsers) => {
    const normalized = nextUsers.map(normalizeUser);
    setUsers(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
  };

  const persistOrders = (nextOrders) => {
    setOrders(nextOrders);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(nextOrders));
    }
  };

  const persistSession = (nextUser) => {
    const normalized = normalizeUser(nextUser);
    setUser(normalized);
    if (typeof window !== 'undefined') {
      if (normalized) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
  };

  const login = ({ email, password }) => {
    const match = users.find((candidate) => candidate.email === email.trim().toLowerCase());
    if (!match || match.password !== password) {
      throw new Error('Credenciales inválidas. Revisa tu correo y contraseña.');
    }
    persistSession(match);
    return normalizeUser(match);
  };

  const register = ({
    email,
    password,
    firstName,
    lastName,
    phone,
    run,
    street,
    region,
    comuna,
    birthDate,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((candidate) => candidate.email === normalizedEmail)) {
      throw new Error('Ya existe una cuenta registrada con este correo.');
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      password,
      firstName,
      lastName,
      phone,
      run,
      street,
      region,
      comuna,
      birthDate: birthDate ?? '',
    };
    const nextUsers = [...users, newUser];
    persistUsers(nextUsers);
    persistSession(newUser);
    return normalizeUser(newUser);
  };

  const logout = () => {
    persistSession(null);
  };

  const updateProfile = (updates) => {
    if (!user) {
      throw new Error('No hay sesión activa.');
    }
    const normalizedEmail = updates.email?.trim().toLowerCase() ?? user.email;
    if (normalizedEmail !== user.email && users.some((candidate) => candidate.email === normalizedEmail)) {
      throw new Error('El correo indicado ya está asociado a otra cuenta.');
    }

    const composedAddress = composeFullAddress({ street: updates.street ?? user.street, comuna: updates.comuna ?? user.comuna, region: updates.region ?? user.region });

    const nextUser = normalizeUser({
      ...user,
      ...updates,
      email: normalizedEmail,
      address: composedAddress,
    });

    const nextUsers = users.map((candidate) =>
      candidate.id === user.id ? nextUser : candidate,
    );

    persistUsers(nextUsers);
    persistSession(nextUser);
    return nextUser;
  };

  const addOrder = (order) => {
    persistOrders([...orders, order]);
  };

  const value = useMemo(
    () => ({
      user,
      users,
      login,
      register,
      logout,
      updateProfile,
      orders,
      addOrder,
    }),
    [user, users, orders],
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
