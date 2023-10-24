import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Templates from './pages/Templates';
import ProjectDetail from './pages/ProjectDetail';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login';
import { getUserData, signOut } from './utils/user';
import { UserData } from './utils/types';
import References from './pages/Reference';
import Admin from './pages/Admin';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Profile from './pages/Profile';
import RiskMapping from './pages/RiskMapping';

const App = () => {
  const [auth, setAuth] = useState<string>('');
  const [active, setActive] = useState('projects');
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
        toast.success('Login successfully');
        const token = localStorage.getItem('token') as string;
        setAuth(token);
        setUserData(res.user);
        return;
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const onSignOutHandler = async () => {
    const res = await signOut();
    if (res.success) {
      toast.success('Sign out successfully');
      localStorage.removeItem('token');
      setAuth('');
      navigate('/login');
    }
  };

  const onSetActive = (data: string) => {
    setActive(data);
  };

  return (
    <div>
      {window.location.pathname !== '/login' && (
        <Navbar
          onSignOutHandler={onSignOutHandler}
          username={userData?.username as string}
        />
      )}
      <div className="flex">
        {window.location.pathname !== '/login' && (
          <Sidebar
            active={active}
            userData={userData as UserData}
            onSetActive={onSetActive}
          />
        )}
        <div
          className={`${
            window.location.pathname !== '/login'
              ? 'pt-8 grow lg:ml-[300px] my-[72px]'
              : 'mx-auto'
          } relative h-fit min-h-[calc(100vh-72px)] `}
        >
          <div
            className={`${
              window.location.pathname !== '/login'
                ? 'w-[85%] mx-auto flex flex-col gap-6'
                : ''
            } `}
          >
            <Routes>
              <Route path="/projects" element={<Projects />} />
              <Route
                path="/projects/:id"
                element={<ProjectDetail userData={userData as UserData} />}
              />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/:id" element={<TemplateDetail />} />
              <Route path="/reference" element={<References />} />
              <Route path="/risk-mapping" element={<RiskMapping />} />
              <Route
                path="/admin"
                element={<Admin userData={userData as UserData} />}
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    setUserData={
                      setUserData as React.Dispatch<
                        React.SetStateAction<UserData>
                      >
                    }
                    userData={userData as UserData}
                  />
                }
              />
              <Route path="/login" element={<Login onSetAuth={onSetAuth} />} />
              <Route path="*" element={<Navigate to={'/projects'} />} />
            </Routes>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
