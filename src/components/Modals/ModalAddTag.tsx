import Modal from '../Modal';
import { useForm } from 'react-hook-form';
type inputs = { tag_name: string };

const ModalAddTag = ({
  dialogTagRef,
  onTagModalSubmit,
}: {
  dialogTagRef: React.RefObject<HTMLDialogElement>;
  onTagModalSubmit: (tag_name: string) => void;
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<inputs>();

  const onClickSubmit = (data: inputs) => {
    onTagModalSubmit(data.tag_name);
    dialogTagRef.current?.close();
    reset();
  };

  return (
    <Modal dialogRef={dialogTagRef}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onClickSubmit)}
      >
        <h1 className="font-bold  text-2xl text-center mb-1">
          Add Checklist Tag
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Name</label>
          <input type="text" {...register('tag_name', { required: true })} />
          {errors.tag_name?.type === 'required' && (
            <p className="text-red-500">Please fill out this field</p>
          )}
        </div>
        <button className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 hover:bg-blue-400 duration-300 font-bold  text-white py-2">
          Create Checklist Tag
        </button>
      </form>
    </Modal>
  );
};

export default ModalAddTag;
