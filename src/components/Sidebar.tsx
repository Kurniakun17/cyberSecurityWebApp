import { useNavigate } from 'react-router-dom';
import { UserData } from '../utils/types';
const Sidebar = ({
  active = 'projects',
  userData,
}: {
  active?: string;
  userData: UserData;
}) => {
  const navigate = useNavigate();

  if (!userData) {
    return <h1>Chihuahua</h1>;
  }

  return (
    <div className="hidden lg:block w-[300px] mt-[72px] pt-8 fixed h-screen border border-l-2 border-l-black">
      <ul>
        <li
          onClick={() => {
            navigate('/projects');
          }}
          className={`px-6 group py-4 hover:bg-gray-50 cursor-pointer text-xl overflow-hidden relative ${
            active === 'projects' &&
            'text-blue-500 bg-gray-200 font-bold hover:bg-gray-200'
          }`}
        >
          Projects
          <div
            className={`${
              active === 'projects' && 'h-10 w-4'
            } h-4 w-4 group-hover:h-10 duration-300 bg-blue-500 rounded-xl absolute top-1/2 -translate-y-1/2 left-[-11px]`}
          ></div>
        </li>
        <li
          className={`px-6 group py-4 hover:bg-gray-50 cursor-pointer text-xl relative  ${
            active === 'templates' &&
            ' text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
          }`}
          onClick={() => {
            navigate('/templates');
          }}
        >
          Templates
          <div
            className={`${
              active === 'templates' && 'h-10 w-4'
            } h-4 w-4 group-hover:h-10 duration-300  bg-blue-500 rounded-xl absolute top-1/2 -translate-y-1/2 left-[-11px]`}
          ></div>
        </li>
        <li
          className={`px-6 group py-4 hover:bg-gray-50 cursor-pointer text-xl relative  ${
            active === 'reference' &&
            ' text-blue-500 bg-gray-200 font-bold  hover:bg-gray-200'
          }`}
          onClick={() => {
            navigate('/reference');
          }}
        >
          Reference
          <div
            className={`${
              active === 'reference' && 'h-10 w-4'
            } h-4 w-4 group-hover:h-10 duration-300  bg-blue-500 rounded-xl absolute top-1/2 -translate-y-1/2 left-[-11px]`}
          ></div>
        </li>
        {userData.admin && (
          <li
            onClick={() => {
              navigate('/admin');
            }}
            className={`px-6 group hover:bg-gray-50 py-4 cursor-pointer text-xl overflow-hidden relative ${
              active === 'admin' &&
              'text-blue-500 bg-gray-200 font-bold hover:bg-gray-200'
            }`}
          >
            Admin
            <div
              className={`${
                active === 'admin' && 'h-10 w-4'
              } h-4 w-4 group-hover:h-10 duration-300 bg-blue-500 rounded-xl absolute top-1/2 -translate-y-1/2 left-[-11px]`}
            ></div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
