import { useNavigate } from 'react-router-dom';
import { UserData } from '../utils/types';
import { useEffect, useState } from 'react';
import { GoRepoTemplate } from 'react-icons/go';
import { RiAdminLine } from 'react-icons/ri';
import { BsBook, BsBookmark } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';
import { Activity, Check, ChevronUp } from 'lucide-react';
import { Collapse } from 'react-collapse';
const Sidebar = ({
  // active,
  userData,
  onSetActive,
}: {
  // active?: string;
  userData: UserData;
  onSetActive: (data: string) => void;
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAccordionActive, setIsAccordionActive] = useState(false);
  const [active, setActive] = useState(window.location.pathname.split('/')[1]);

  useEffect(() => {
    if (userData) {
      setIsAdmin(userData.admin);
    }

    if (active === 'reference' || active === 'risk-mapping') {
      setIsAccordionActive(true);
    }
  }, [userData]);

  useEffect(() => {
    const path = window.location.pathname.split('/')[1];
    setActive(path);
    if (path !== 'reference' && path !== 'risk-mapping') {
      setIsAccordionActive(false);
    }
  }, [window.location.pathname]);

  useEffect(() => {
    // if (!isAccordionActive) {
    //   const checklist = document.getElementById('checklist');
    //   checklist?.classList.add('hidden');
    // }
  }, []);

  useEffect(() => {
    // const checklist = document.getElementById('checklist');
    // // const riskMapping = document.getElementById('risk-mapping');
    // if (!isAccordionActive) {
    //   console.log(isAccordionActive);
    //   setTimeout(() => {
    //     checklist?.classList.add('hidden');
    //     checklist?.classList.remove('flex');
    //   }, 900);
    // } else {
    //   setTimeout(() => {
    //     checklist?.classList.remove('hidden');
    //     checklist?.classList.add('flex');
    //   }, 900);
    // }
  }, [isAccordionActive]);

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
        <li className="flex flex-col">
          <button
            className={`flex items-center w-full justify-between px-6 group py-4 cursor-pointer text-xl relative  `}
            onClick={() => {
              setIsAccordionActive((prev) => !prev);
            }}
          >
            <div className="flex gap-4">
              <BsBookmark size="26" />
              <p>Reference</p>
            </div>

            <ChevronUp
              className={`
              ${
                isAccordionActive ? 'rotate-[180deg]' : 'rotate-[0deg]'
              } duration-300`}
            />
          </button>
          <Collapse isOpened={isAccordionActive}>
            <div
              className={`items-center flex duration-1000 gap-4 px-12 group py-4 cursor-pointer text-xl relative  ${
                active === 'reference'
                  ? ' text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                navigate('/reference');
                onSetActive('reference');
              }}
            >
              <Check size="26" />
              <p>Checklist</p>
            </div>

            <div
              id="risk-mapping"
              className={`items-center duration-1000 ${
                isAccordionActive
                  ? 'opacity-1 flex translate-y-0 '
                  : 'opacity-0 -translate-y-4'
              }  gap-4 px-12 group py-4 cursor-pointer text-xl relative  ${
                active === 'risk-mapping'
                  ? ' text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                navigate('/risk-mapping');
                onSetActive('risk-mapping');
              }}
            >
              <Activity size="26" />
              <p>Risk Mapping</p>
            </div>
          </Collapse>
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
            <RiAdminLine
              className={'text-[28px]'}
              color={active === 'admin' ? '#3b82f6' : '#000'}
            />
            <p>Admin</p>
          </li>
        )}
        <li
          onClick={() => {
            navigate('/profile');
            onSetActive('profile');
          }}
          className={`flex items-center gap-4 px-6 group py-4 cursor-pointer text-xl overflow-hidden relative ${
            active === 'profile'
              ? 'text-blue-500 bg-gray-200 font-bold hover:bg-gray-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <BiUserCircle size="28" className="shrink-0" />
          <p>Profile</p>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
