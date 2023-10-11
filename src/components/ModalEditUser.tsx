import React, { useEffect, useRef } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { Pen } from "lucide-react";
import { userDataT } from "../utils/types";
import { editUserByAdmin } from "../utils/user";
import toast from "react-hot-toast";

type inputs = {
  edit_id: string;
  edit_name: string;
  edit_username: string;
  edit_isAdmin: boolean;
  edit_email: string;
  edit_phone: string;
  edit_status: string;
};

const ModalEditUser = ({
  userData,
  refetchUserData,
}: {
  userData: userDataT;
  refetchUserData: () => void;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<inputs>();

  useEffect(() => {
    setValue("edit_name", userData.name);
    setValue("edit_isAdmin", userData.admin);
    setValue("edit_phone", userData.phone);
    setValue("edit_username", userData.username);
    setValue("edit_phone", userData.phone);
    setValue("edit_email", userData.email);
    setValue("edit_id", userData.id);
    setValue("edit_status", userData.status);
  }, []);

  const dialogEditUser = useRef<HTMLDialogElement>(null);
  const editUserSubmit = async (data: inputs) => {
    const body = {
      name: data.edit_name,
      email: data.edit_email,
      phone: data.edit_phone,
      status: data.edit_status,
      admin: data.edit_isAdmin,
    };

    const res = await editUserByAdmin(userData.id, body);
    if (res.success) {
      toast.success("Edit user success");
      refetchUserData();
      return;
    }
    toast.error("Edit user failed");
  };

  return (
    <>
      <button
        className="w-full flex justify-center"
        onClick={() => {
          dialogEditUser.current?.showModal();
        }}
      >
        <Pen />
      </button>
      <Modal dialogRef={dialogEditUser}>
        <form
          onSubmit={handleSubmit(editUserSubmit)}
          className="flex flex-col gap-3"
        >
          <h2 className="font-bold  text-2xl text-center mb-1">
            Edit User Account
          </h2>
          <div className="w-full">
            <label htmlFor="edit_name">Name</label>
            <input type="text" {...register("edit_name", { required: true })} />
            {errors.edit_name?.type === "required" && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="edit_email">Email</label>
            <input
              type="email"
              {...register("edit_email", {
                required: true,
                pattern: /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/i,
              })}
            />
            {errors.edit_email?.type === "required" && (
              <p className="text-red-500">Please fill out this field</p>
            )}
            {errors.edit_email?.type === "pattern" && (
              <p className="text-red-500">
                Please input a correct email address
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="edit_phone">Phone Number</label>
            <input
              type="text"
              {...register("edit_phone", { required: true })}
            />
            {errors.edit_phone?.type === "required" && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="w-full flex gap-4 mt-2 items-center">
            <label htmlFor="status">Status</label>
            <select
              className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-md border-[#d7d7d7] col-span-4"
              {...register("edit_status")}
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div className="w-full flex gap-4">
            <label htmlFor="isAdmin">Admin</label>
            <input
              type="checkbox"
              className="w-5 border border-[#d7d7d7] text-blue-500 bg-blue-500"
              {...register("edit_isAdmin")}
            />
          </div>

          <button
            type="submit"
            onClick={() => dialogEditUser.current?.close()}
            className="w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ModalEditUser;
