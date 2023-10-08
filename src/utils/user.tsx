import { api } from './api';

const loginAuth = async (body: { username: string; password: string }) => {
  try {
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

const getAllUserData = async (pageCount: number, sizeCount: number) => {
  const res = await api.get(
    `http://localhost:3000/user?size=${sizeCount}&page=${pageCount}`
  );
  return res.data;
};

const registerUser = async (body: { username: string; password: string }) => {
  try {
    const res = await api.post('http://localhost:3000/user/register', body);

    return res.data;
  } catch (error) {
    return error;
  }
};

const signOut = async () => {
  const res = await api.post('http://localhost:3000/user/auth/logout');

  return res.data;
};

const searchUser = async (username: string) => {
  const res = await api.get(
    `http://localhost:3000/user/search?username=${username}`
  );

  return res.data;
};

export {
  searchUser,
  signOut,
  loginAuth,
  getUserData,
  getAllUserData,
  registerUser,
};
