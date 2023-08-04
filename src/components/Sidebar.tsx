import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ active = 'projects' }: { active?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[300px] pt-8 h-screen border border-l-2 border-l-black">
      <ul>
        <li
          onClick={() => {
            navigate('/projects');
          }}
          className={`px-6 py-4 cursor-pointer text-xl ${
            active === 'projects' && 'text-blue-500 bg-gray-300 font-bold'
          }`}
        >
          Projects
        </li>
        <li
          className={`px-6 py-4 cursor-pointer text-xl ${
            active === 'templates' && 'text-blue-500 bg-gray-300 font-bold'
          }`}
          onClick={() => {
            navigate('/templates');
          }}
        >
          Templates
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
