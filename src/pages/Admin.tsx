import { useNavigate } from 'react-router-dom';
import { UserData, userDataT } from '../utils/types';
import { useForm } from 'react-hook-form';
import { getAllUserData, registerUser } from '../utils/user';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type inputs = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
};

const Admin = ({ userData }: { userData: UserData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<inputs>();
  const [allUserData, setAllUserData] = useState<userDataT[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const navigate = useNavigate();
  const dialogAddUser = useRef<HTMLDialogElement>(null);
  const limit = 2;

  const fetchAllUserData = async (pageCount: number, sizeCount: number) => {
    const res = await getAllUserData(pageCount, sizeCount);
    setTotalPage(res.data.totalPages);
    setAllUserData(res.data.items);
  };

  useEffect(() => {
    fetchAllUserData(0, limit);
  }, []);

  const submitHandler = async (res: inputs) => {
    const data = await registerUser(res);

    if (data.success) {
      fetchAllUserData(0, limit);
      toast.success('Account has been successfully created', {
        position: 'top-right',
      });
      dialogAddUser.current?.close();
      reset();
      return;
    }

    toast.error(data.response.data.error, {
      position: 'top-right',
    });
  };

  const onPageHandleClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
    fetchAllUserData(data.selected, limit);
  };

  if (userData === undefined) {
    return null;
  }

  if (!userData.admin) {
    navigate('/projects');
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">User List</h1>
          <button
            onClick={() => {
              dialogAddUser.current?.showModal();
            }}
            className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] duration-300 hover:border-blue-500 w-fit"
          >
            <span className="text-blue-500 text-sm font-bold">+</span> Add User
          </button>
        </div>

        <table className="table-auto">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="font-semibold text-start p-1 px-4">Username</th>
              <th className="font-semibold text-start p-1 px-4">Name</th>
              <th className="font-semibold text-start p-1 px-4">Email</th>
              <th className="font-semibold text-start p-1 px-4">Phone</th>
              <th className="font-semibold text-start p-1 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {allUserData.map((user: userDataT) => {
              return (
                <tr key={user.id} className=" border-b-[1px] border-slate-200">
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">{user.admin ? 'Admin' : 'Employee'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={totalPage}
          forcePage={currentPage}
          breakLabel="..."
          onPageChange={onPageHandleClick}
          containerClassName="absolute bottom-24 left-1/2  -translate-x-1/2 flex gap-3 w-fit mx-auto"
          pageClassName="p-2 px-4 rounded-md border font-bold"
          nextClassName="p-2 px-4 border rounded-md font-bold"
          previousClassName="p-2 px-4 border rounded-md font-bold "
          activeClassName="border text-blue-500 border-blue-500"
        ></ReactPaginate>
      </div>
      <Modal dialogRef={dialogAddUser}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col items-center gap-3 p-4 w-[500px]"
        >
          <h2 className="font-bold  text-2xl text-center mb-1">
            Create Account
          </h2>
          <div className="w-full">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: true })}
            />
            {errors.name?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              {...register('username', { required: true })}
            />
            {errors.username?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: true,
                minLength: 12,
                pattern:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#])[A-Za-z\d@!#]+$/i,
              })}
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500">
                Password must be at least 12 characters
              </p>
            )}
            {errors.password?.type === 'pattern' && (
              <p className="text-red-500">
                Password must be at least contain 1 uppercase, 1 lowercase, 1
                number, and 1 special character
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
            />
            {errors.email?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              {...register('phone', { required: true })}
            />
            {errors.phone?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>

          <button className="w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2">
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Admin;
