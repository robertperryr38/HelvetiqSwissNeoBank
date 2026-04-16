const normalizedApiBaseUrl = (
  process.env.REACT_APP_API_URL || 'http://localhost:3001'
).replace(/\/+$/, '');

export const API_BASE_URL = normalizedApiBaseUrl;

export const apiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedApiBaseUrl}${normalizedPath}`;
};
