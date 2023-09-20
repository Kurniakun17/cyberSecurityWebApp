import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Navbar from './components/Navbar';
import Templates from './pages/Templates';
import ProjectDetail from './pages/ProjectDetail';
import TemplateDetail from './pages/TemplateDetail';
import Test from './pages/test';

const App = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetail />} />
        <Route path="/test" element={<Test />} />
         
        <Route path="*" element={<Navigate to={'/projects'} />} />
      </Routes>
    </div>
  );
};

export default App;
