import { api, mainUrl } from './api';

const loginAuth = async (body: { username: string; password: string }) => {
  try {
    const res = await api.post(`${mainUrl}/user/auth/login`, body);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    return error;
  }
};

const getUserData = async () => {
  const res = await api.get(`${mainUrl}/user/me`);

  return res.data;
};

const getAllUserData = async (pageCount: number, sizeCount: number) => {
  const res = await api.get(
    `${mainUrl}/user?size=${sizeCount}&page=${pageCount}`
  );
  return res.data;
};

const registerUser = async (body: { username: string; password: string }) => {
  try {
    const res = await api.post(`${mainUrl}/user/register`, body);

    return res.data;
  } catch (error) {
    return error;
  }
};

const signOut = async () => {
  const res = await api.post(`${mainUrl}/user/auth/logout`);
  return res.data;
};

const searchUser = async (username: string) => {
  const res = await api.get(`${mainUrl}/user/search?username=${username}`);
  return res.data;
};

const editUserByAdmin = async (userId: string, body: unknown) => {
  try {
    const res = await api.put(`${mainUrl}/user/${userId}/edit`, body);
    return res.data;
  } catch (error) {
    return error;
  }
};

const changePassword = async (body: {
  old_password: string;
  new_password: string;
}) => {
  try {
    const res = await api.post(`${mainUrl}/user/auth/change-password`, body);
    return res.data;
    console.log(res.data);
  } catch (error) {
    console.log(error);

    return error;
  }
};

export {
  searchUser,
  editUserByAdmin,
  signOut,
  loginAuth,
  getUserData,
  getAllUserData,
  registerUser,
  changePassword,
};
