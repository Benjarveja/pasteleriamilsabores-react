const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api').replace(/\/$/, '');
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 15000);

const getStoredToken = () => {
  try {
    const raw = window.localStorage.getItem('milSaboresTokens');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch (error) {
    console.warn('No se pudo leer el token almacenado.', error);
    return null;
  }
};

const DEFAULT_ERROR_MESSAGES = {
  400: 'La solicitud contiene datos inválidos.',
  401: 'Tu sesión expiró. Inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'No encontramos el recurso solicitado.',
  409: 'Ya existe un registro con esos datos.',
  422: 'No pudimos procesar la información enviada.',
  500: 'Ocurrió un error inesperado en el servidor.',
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }
}

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (/^https?:/i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  if (!isJson) {
    const text = await response.text();
    return text || null;
  }
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const buildHeaders = ({ token, hasBody, headers }) => {
  const composed = new Headers({ Accept: 'application/json', ...headers });
  if (hasBody && !composed.has('Content-Type')) {
    composed.set('Content-Type', 'application/json');
  }
  let authToken = token;
  if (authToken === undefined) {
    authToken = getStoredToken();
  } else if (typeof authToken === 'function') {
    authToken = authToken();
  }
  if (authToken) {
    composed.set('Authorization', `Bearer ${authToken}`);
  } else {
    composed.delete('Authorization');
  }
  return composed;
};

export const request = async (path, { method = 'GET', data, token, headers, timeout = API_TIMEOUT, signal, customErrorMessage } = {}) => {
  const controller = signal ? null : new AbortController();
  const requestSignal = signal ?? controller.signal;
  if (!signal && !controller) {
    throw new Error('No fue posible crear el controlador de la solicitud.');
  }
  const timeoutId = setTimeout(() => controller?.abort(), timeout);

  const hasBody = data !== undefined && data !== null;
  const init = {
    method,
    headers: buildHeaders({ token, hasBody, headers }),
    signal: requestSignal,
  };

  if (hasBody) {
    init.body = typeof data === 'string' ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(buildUrl(path), init);
    const payload = await parseResponseBody(response);
    if (!response.ok) {
      const message = payload?.message || customErrorMessage || DEFAULT_ERROR_MESSAGES[response.status] || DEFAULT_ERROR_MESSAGES[500];
      throw new ApiError(message, response.status, payload);
    }
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('La solicitud fue cancelada por demorar demasiado.', 'ABORTED');
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('No pudimos conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.', 'NETWORK');
  } finally {
    clearTimeout(timeoutId);
  }
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, options) => request(path, { ...options, method: 'POST' }),
  put: (path, options) => request(path, { ...options, method: 'PUT' }),
  patch: (path, options) => request(path, { ...options, method: 'PATCH' }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
};
