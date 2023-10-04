import { useForm } from 'react-hook-form';
import { loginAuth } from '../utils/user';
import toast from 'react-hot-toast';

type inputs = {
  username: string;
  password: string;
};

const Login = ({ onSetAuth }: { onSetAuth: (token: string) => void }) => {
  const { register, handleSubmit } = useForm<inputs>();

  const onLoginSubmit = async (res: inputs) => {
    const data = await loginAuth(res);
    if (data.success) {
      toast.success('Login successfully');
      onSetAuth(data.token);
    } else {
      toast.error('Wrong username or password');
    }
  };

  return (
    <div className="h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit(onLoginSubmit)}
        className="flex flex-col gap-2 items-center justify-center w-[300px] p-4 shadow-xl border border-blue-500 rounded-md"
      >
        <h1 className="text-xl font-bold">Login</h1>
        <div className="w-full">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register('username')}
            placeholder="Chihuahua"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Projects"
          />
        </div>
        <button
          type="submit"
          className="mt-2 font-semibold rounded-xl bg-blue-500 mx-4 text-white w-full py-2 "
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
