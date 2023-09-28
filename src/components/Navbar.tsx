import { useNavigate } from 'react-router-dom';
const Navbar = ({
  onSignOutHandler,
  username,
}: {
  onSignOutHandler: () => void;
  username: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className="h-[72px] w-full z-50 fixed top-0 text-white flex items-center justify-between px-8 bg-blue-500">
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
        <p className=" font-semibold">Welcome, {username}</p>
        <button
          type="button"
          className="px-4 cursor-pointer py-1 border hover:text-blue-500 hover:bg-white duration-300 rounded-lg"
          onClick={onSignOutHandler}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
