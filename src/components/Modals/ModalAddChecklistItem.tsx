import React from 'react';
import Modal from '../Modal';
import { useForm } from 'react-hook-form';

type inputs = {
  checklist_name: string;
};

const ModalAddChecklistItem = ({
  dialogChecklistRef,
  onChecklistTagModalSubmit,
}: {
  dialogChecklistRef: React.RefObject<HTMLDialogElement>;
  onChecklistTagModalSubmit: (tag_name: string) => void;
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<inputs>();

  const onClickSubmit = (data: inputs) => {
    onChecklistTagModalSubmit(data.checklist_name);
    reset();
  };
  return (
    <Modal dialogRef={dialogChecklistRef}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onClickSubmit)}
      >
        <h1 className="font-bold  text-2xl text-center mb-1">
          Add Checklist Item
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Name</label>
          <input
            type="text"
            {...register('checklist_name', { required: true })}
          />
          {errors.checklist_name?.type === 'required' && (
            <p className="text-red-500">Please fill out this field</p>
          )}
        </div>
        <button className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 hover:bg-blue-400 duration-300 font-bold  text-white py-2">
          Create Checklist Item
        </button>
      </form>
    </Modal>
  );
};

export default ModalAddChecklistItem;
