import { useNavigate } from 'react-router-dom';
import { UserData } from '../utils/types';
import { useEffect, useState } from 'react';
import { GoRepoTemplate } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';
import { BsBook, BsBookmark } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';

const Sidebar = ({
  active,
  userData,
  onSetActive,
}: {
  active?: string;
  userData: UserData;
  onSetActive: (data: string) => void;
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsAdmin(userData.admin);
    }
  }, [userData]);

  return (
    <div
      key={active}
      className="hidden lg:block w-[300px] mt-[72px] pt-8 fixed h-screen border border-l-2 border-l-black"
    >
      <ul>
        <li
          onClick={() => {
            navigate('/projects');
            onSetActive('projects');
          }}
          className={`flex items-center gap-4 px-6 group py-4 cursor-pointer text-xl overflow-hidden relative ${
            active === 'projects'
              ? 'text-blue-500 bg-gray-200 font-bold hover:bg-gray-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <BsBook size="24" />
          <p>Projects</p>
        </li>
        <li
          className={`flex items-center gap-4 px-6 group py-4 cursor-pointer text-xl relative  ${
            active === 'templates'
              ? 'text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            navigate('/templates');
            onSetActive('templates');
          }}
        >
          <GoRepoTemplate size="28" />
          <p>Templates</p>
        </li>
        <li
          className={`flex items-center gap-4 px-6 group py-4 cursor-pointer text-xl relative  ${
            active === 'reference'
              ? ' text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            navigate('/reference');
            onSetActive('reference');
          }}
        >
          <BsBookmark size="26" />
          <p>Reference</p>
        </li>
        {isAdmin && (
          <li
            onClick={() => {
              navigate('/admin');
              onSetActive('admin');
            }}
            className={`flex items-center gap-4 px-6 group py-4 cursor-pointer text-xl overflow-hidden relative ${
              active === 'admin'
                ? 'text-blue-500 bg-gray-200 font-bold hover:bg-gray-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <BiUserCircle size="28" className="shrink-0" />
            <p>Admin</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
