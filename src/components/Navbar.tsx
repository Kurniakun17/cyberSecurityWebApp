import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="h-[72px] w-full z-50 fixed text-white flex items-center justify-between px-8 bg-blue-500">
      <div className="flex gap-5">
        <button
          className="font-bold text-2xl"
          onClick={() => {
            navigate('/projects');
          }}
        >
          Logo
        </button>
        <button
          className="font-bold text-2xl"
          onClick={() => {
            navigate('/templates');
          }}
        >
          Templates
        </button>
      </div>
      <div className="flex items-center gap-5">
        <p className=" font-semibold">Welcome, Mario</p>
        <button
          type="button"
          className="px-4 cursor-pointer py-1 border rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
