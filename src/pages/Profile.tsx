import { useForm } from 'react-hook-form';
import { UserData } from '../utils/types';
import { useEffect } from 'react';
import { editProfile } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = ({ userData }: { userData: UserData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserData>();
  useEffect(() => {
    if (userData) {
      setValue('email', userData.email);
      setValue('phone', userData.phone);
      setValue('name', userData.name);
      setValue('username', userData.username);
    }
  }, [setValue, userData]);

  const onClickSubmit = async (inputValue: UserData) => {
    const res = await editProfile(inputValue);

    if (res.success) {
      toast.success(res.msg);
      return;
    }
    toast.error('Edit profile failed');
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(onClickSubmit)}
    >
      <h2 className="font-bold text-2xl">Profile</h2>
      {userData && (
        <table className="border-separate border-spacing-y-4">
          <tbody>
            <tr className="">
              <td className="w-fit">
                <label htmlFor="profile_username">Username</label>
              </td>
              <td>
                <input
                  id="profile_username"
                  type="text"
                  {...register('username')}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td className="w-fit">
                <label htmlFor="profile_name">Name</label>
              </td>
              <td>
                <input
                  id="profile_name"
                  type="text"
                  {...register('name', { required: true })}
                />
                {errors.name?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-fit">
                <label htmlFor="profile_email">Email</label>
              </td>
              <td>
                <input
                  id="profile_email"
                  type="text"
                  {...register('email', {
                    required: true,

                    pattern: /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/i,
                  })}
                />
                {errors.email?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}
                {errors.email?.type === 'pattern' && (
                  <p className="text-red-500">
                    Please input a correct email address
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-fit">
                <label htmlFor="profile_phone">phone</label>
              </td>
              <td>
                <input
                  id="profile_phone"
                  type="text"
                  {...register('phone', { required: true })}
                />
                {errors.phone?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button
        type="submit"
        className="cursor-pointer w-full bg-blue-500 py-2 text-white font-bold rounded-xl hover:bg-blue-400 text-center"
      >
        Submit
      </button>
    </form>
  );
};

export default Profile;
