import api from './api';

const formatUsername = (name, email) => {
  if (!name) {
    return email.split('@')[0];
  }
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);
};

export const authService = {
  async login({ email, password }) {
    const response = await api.post('/auth/login/', {
      email,
      password,
    });
    return {
      token: response.data.access,
      user: response.data.user,
    };
  },

  async register({ name, email, password }) {
    const username = formatUsername(name, email);
    const response = await api.post('/auth/register/', {
      username,
      email,
      password,
    });
    return {
      token: response.data.access,
      user: response.data.user,
    };
  },
};
