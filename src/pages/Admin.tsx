import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserData } from '../utils/types';

const Admin = ({ userData }: { userData: UserData }) => {
  const navigate = useNavigate();
  if (userData === undefined) {
    return <h1>Chihuahua</h1>;
  }

  if (!userData.admin) {
    navigate('/projects');
  }
  return (
    <div className="flex">
      <Sidebar active="admin" userData={userData} />
      <div className="lg:ml-[300px] my-[72px] py-8 grow">
        <div className="w-[85%] mx-auto flex flex-col gap-6 overflow-visible">
          <div className="flex flex-col gap-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
