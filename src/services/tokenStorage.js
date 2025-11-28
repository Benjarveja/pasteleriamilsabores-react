const TOKEN_KEY = 'milSaboresTokens';
const SESSION_KEY = 'milSaboresSession';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const read = (key) => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`No se pudo leer ${key} desde localStorage`, error);
    return null;
  }
};

const write = (key, value) => {
  if (!isBrowser()) return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`No se pudo persistir ${key} en localStorage`, error);
  }
};

export const tokenStorage = {
  getTokens: () => read(TOKEN_KEY),
  saveTokens: (tokens) => write(TOKEN_KEY, tokens),
  clearTokens: () => write(TOKEN_KEY, null),
  getSession: () => read(SESSION_KEY),
  saveSession: (session) => write(SESSION_KEY, session),
  clearSession: () => write(SESSION_KEY, null),
  clearAll: () => {
    tokenStorage.clearTokens();
    tokenStorage.clearSession();
  },
};

