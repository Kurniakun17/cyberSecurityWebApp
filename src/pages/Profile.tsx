import { useForm } from 'react-hook-form';
import { UserData } from '../utils/types';
import { useEffect } from 'react';
import { editProfile } from '../utils/api';
import toast from 'react-hot-toast';
import { changePassword, getUserData } from '../utils/user';

type inputsPW = {
  old_password: string;
  new_password: string;
  confirmation_password: string;
};

const Profile = ({
  userData,
  setUserData,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserData>();

  const {
    register: registerPW,
    handleSubmit: handleSubmitPW,
    reset,
    formState: { errors: errorsPW },
  } = useForm<inputsPW>();

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
      const refetchData = await getUserData();
      setUserData(refetchData.user);
      return;
    }
    toast.error('Edit profile failed');
  };

  const onChangePasswordHandler = async (res: inputsPW) => {
    if (res.confirmation_password != res.new_password) {
      return toast.error(
        `Your new password doesn't match the confirmation password`
      );
    }

    const response = await changePassword(res);

    if (response.success) {
      toast.success('Password has been successfully changed!');
      reset();
      return;
    }
    console.log(response.data);
  };

  if (!userData) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col gap-16  ">
      <form
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onClickSubmit)}
      >
        <h2 className="font-bold text-2xl">Profile</h2>
        {userData && (
          <table className="border-separate border-spacing-y-4">
            <tbody>
              <tr className="">
                <td className="w-[200px]">
                  <label htmlFor="profile_username">Username</label>
                </td>
                <td>
                  <p className="pl-2">{userData.username}</p>
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

      {/* password */}
      <form
        onSubmit={handleSubmitPW(onChangePasswordHandler)}
        className="flex flex-col gap-2"
      >
        <h2 className="font-bold text-2xl">Change Password</h2>
        <table className="border-separate border-spacing-y-4">
          <tbody>
            <tr>
              <td className="w-[200px]">
                <label htmlFor="old_password">Old Password</label>
              </td>
              <td>
                <input
                  id="old_password"
                  type="text"
                  {...registerPW('old_password', {
                    required: true,
                    minLength: 12,
                    pattern:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#])[A-Za-z\d@!#]+$/i,
                  })}
                />
                {errorsPW.old_password?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}

                {errorsPW.old_password?.type === 'minLength' && (
                  <p className="text-red-500">
                    Password must be at least 12 characters
                  </p>
                )}
                {errorsPW.old_password?.type === 'pattern' && (
                  <p className="text-red-500">
                    Password must be at least contain 1 uppercase, 1 lowercase,
                    1 number, and 1 special character
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-fit">
                <label htmlFor="new_password">New Password</label>
              </td>
              <td>
                <input
                  id="new_password"
                  type="text"
                  {...registerPW('new_password', {
                    required: true,
                    minLength: 12,
                    pattern:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#])[A-Za-z\d@!#]+$/i,
                  })}
                />
                {errorsPW.new_password?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}
                {errorsPW.new_password?.type === 'minLength' && (
                  <p className="text-red-500">
                    Password must be at least 12 characters
                  </p>
                )}
                {errorsPW.new_password?.type === 'pattern' && (
                  <p className="text-red-500">
                    Password must be at least contain 1 uppercase, 1 lowercase,
                    1 number, and 1 special character
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-fit">
                <label htmlFor="confirmation_password">
                  Confirmation Password
                </label>
              </td>
              <td>
                <input
                  id="confirmation_password"
                  type="text"
                  {...registerPW('confirmation_password', {
                    required: true,
                    minLength: 12,
                    pattern:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#])[A-Za-z\d@!#]+$/i,
                  })}
                />
                {errorsPW.confirmation_password?.type === 'required' && (
                  <p className="text-red-500">Please fill out this field</p>
                )}
                {errorsPW.confirmation_password?.type === 'minLength' && (
                  <p className="text-red-500">
                    Password must be at least 12 characters
                  </p>
                )}
                {errorsPW.confirmation_password?.type === 'pattern' && (
                  <p className="text-red-500">
                    Password must be at least contain 1 uppercase, 1 lowercase,
                    1 number, and 1 special character
                  </p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-500 py-2 text-white font-bold rounded-xl hover:bg-blue-400 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Profile;
