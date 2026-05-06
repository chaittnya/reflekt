import { mockDelay } from './api';

// Mock users store
const MOCK_USERS = [
  {
    id: '1',
    name: 'Alex Morgan',
    email: 'demo@mindtrack.app',
    password: 'Demo@1234',
  },
];

const generateToken = (userId) =>
  `mock_jwt_token_${userId}_${Date.now()}`;

export const authService = {
  async login({ email, password }) {
    await mockDelay(1200);

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw { response: { data: { message: 'Invalid email or password' } } };
    }

    const token = generateToken(user.id);
    const { password: _, ...safeUser } = user;

    return { token, user: safeUser };
  },

  async register({ name, email, password }) {
    await mockDelay(1400);

    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      throw {
        response: { data: { message: 'An account with this email already exists' } },
      };
    }

    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      password,
    };
    MOCK_USERS.push(newUser);

    const token = generateToken(newUser.id);
    const { password: _, ...safeUser } = newUser;

    return { token, user: safeUser };
  },
};
