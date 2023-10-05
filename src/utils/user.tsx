import { api } from './api';

const loginAuth = async (body: { username: string; password: string }) => {
  try {
    console.log(body);
    const res = await api.post('http://localhost:3000/user/auth/login', body);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    return { success: false };
  }
};

const getUserData = async () => {
  const res = await api.get('http://localhost:3000/user/me');

  return res.data;
};

const registerUser = async (body: { username: string; password: string }) => {
  const res = await api.post('http://localhost:3000/user/register', body);

  return res.data;
};

const signOut = async () => {
  const res = await api.post('http://localhost:3000/user/auth/logout');

  return res.data;
};

export { signOut, loginAuth, getUserData, registerUser };
