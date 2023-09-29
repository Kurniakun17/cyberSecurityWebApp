import { useNavigate } from 'react-router-dom';
import { UserData } from '../utils/types';
import { useForm } from 'react-hook-form';
import { registerUser } from '../utils/user';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { useRef } from 'react';

type inputs = {
  username: string;
  password: string;
};

const Admin = ({ userData }: { userData: UserData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<inputs>();
  const navigate = useNavigate();
  const dialogAddUser = useRef<HTMLDialogElement>(null);

  const submitHandler = async (res: inputs) => {
    const data = await registerUser(res);

    if (data.success) {
      toast.success('Account has been successfully created', {
        position: 'top-right',
      });
      reset();
    }
  };

  if (userData === undefined) {
    return null;
  }

  if (!userData.admin) {
    navigate('/projects');
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col items-center gap-3 mt-12 p-4 rounded-xl w-[500px] shadow-lg mx-auto"
    >
      <h2 className="font-bold  text-2xl text-center mb-1">Create Account</h2>
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
      <button className="w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2">
        Submit
      </button>
    </form>
  );
};

export default Admin;
