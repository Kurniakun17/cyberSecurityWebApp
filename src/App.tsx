import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Templates from './pages/Templates';
import ProjectDetail from './pages/ProjectDetail';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login';
import { getUserData } from './utils/user';
import { UserData } from './utils/types';
import References from './pages/Reference';
import Admin from './pages/Admin';

const App = () => {
  const [auth, setAuth] = useState<string>('');
  const [userData, setUserData] = useState<UserData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      keepLogin();
      return;
    }

    if (window.location.pathname === '/login') navigate('/projects');
  }, [auth]);

  const onSetAuth = async (token: string) => {
    setAuth(token);
    const res = await getUserData();
    if (res.success) {
      setUserData(res.user);
    }
  };

  const keepLogin = async () => {
    try {
      const res = await getUserData();
      if (res.success) {
        const token = localStorage.getItem('token') as string;
        setAuth(token);
        setUserData(res.user);
        return;
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const onSignOutHandler = () => {
    localStorage.removeItem('token');
    setAuth('');
    navigate('/login');
  };

  return (
    <div>
      {window.location.pathname !== '/login' && (
        <Navbar
          onSignOutHandler={onSignOutHandler}
          username={userData?.username as string}
        />
      )}
      <Routes>
        <Route
          path="/projects"
          element={<Projects userData={userData as UserData} />}
        />
        <Route
          path="/projects/:id"
          element={<ProjectDetail userData={userData as UserData} />}
        />
        <Route
          path="/templates"
          element={<Templates userData={userData as UserData} />}
        />
        <Route
          path="/templates/:id"
          element={<TemplateDetail userData={userData as UserData} />}
        />
        <Route
          path="/reference"
          element={<References userData={userData as UserData} />}
        />
        <Route
          path="/admin"
          element={<Admin userData={userData as UserData} />}
        />
        <Route path="/login" element={<Login onSetAuth={onSetAuth} />} />
        <Route path="*" element={<Navigate to={'/projects'} />} />
      </Routes>
    </div>
  );
};

export default App;
