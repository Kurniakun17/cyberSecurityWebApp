import { api } from './helper';

const loginAuth = async (body: { username: string; password: string }) => {
  const res = await api.post('http://localhost:3000/user/auth/login', body);
  localStorage.setItem('token', res.data.token);
  return res.data;
};

const getUserData = async () => {
  const res = await api.get('http://localhost:3000/user/me');

  return res.data;
};

export { loginAuth, getUserData };
