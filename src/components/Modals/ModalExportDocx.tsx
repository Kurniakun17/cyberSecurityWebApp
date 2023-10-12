import React from 'react';
import Modal from '../Modal';
import { useForm } from 'react-hook-form';

type inputs = {
  client_name: string;
  report_type: string;
};

const ModalExportDocx = ({
  dialogExportToDocx,
  onExportModalSubmit,
}: {
  dialogExportToDocx: React.RefObject<HTMLDialogElement>;
  onExportModalSubmit: (client_name: string, report_type: string) => void;
}) => {
  const {
    handleSubmit,
    register,
    reset,
  } = useForm<inputs>();

  const onClickSubmit = (data: inputs) => {
    onExportModalSubmit(data.client_name, data.report_type);
    
    reset();
  };

  return (
    <Modal dialogRef={dialogExportToDocx}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onClickSubmit)}
      >
        <h1 className="font-bold text-blue-500 text-2xl text-center mb-1">
          Export project to Docx
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Client Name</label>
          <input
            placeholder="PT ABC"
            type="text"
            {...register('client_name')}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Report Type</label>
          <input
            placeholder="Early Report Web App ABC"
            type="text"
            {...register('report_type')}
          />
        </div>
        <button className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2">
          Create docx
        </button>
      </form>
    </Modal>
  );
};

export default ModalExportDocx;
