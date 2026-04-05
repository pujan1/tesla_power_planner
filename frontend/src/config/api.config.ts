export const API_BASE_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/login',
  },
  users: {
    create: '/users',
    get: (username: string) => `/users/${username}`,
    update: (username: string) => `/users/${username}`,
  }
};
