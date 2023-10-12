import { useForm } from 'react-hook-form';
import Modal from '../Modal';
import { useEffect } from 'react';

type inputs = {
  update_tag_name: string;
};

const ModalEditTag = ({
  dialogEditTag,
  onSubmitEditTag,
  defaultValue,
}: {
  dialogEditTag: React.RefObject<HTMLDialogElement>;
  onSubmitEditTag: (update_tag_name: string) => void;
  defaultValue: string;
}) => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<inputs>();

  useEffect(() => {
    setValue('update_tag_name', defaultValue);
  }, [defaultValue]);

  const onClickSubmit = (data: inputs) => {
    onSubmitEditTag(data.update_tag_name);
    dialogEditTag.current?.close();
    reset();
  };

  return (
    <Modal dialogRef={dialogEditTag}>
      <form
        onSubmit={handleSubmit(onClickSubmit)}
        className="flex flex-col gap-3 text-black"
      >
        <h1 className="font-bold  text-2xl text-center mb-1">
          Edit Checklist Tag
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="checklistTag" className="text-grayText">
            Tag name
          </label>
          <input
            {...register('update_tag_name', { required: true })}
            id="checklistTag"
            type="text"
            className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
          />
          {errors.update_tag_name?.type === 'required' && (
            <p className="text-red-500">Please fill out this field</p>
          )}
        </div>
        <button
          onClick={() => {}}
          className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditTag;
