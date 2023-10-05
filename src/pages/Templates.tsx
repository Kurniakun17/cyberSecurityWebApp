import { useRef, useState } from 'react';
import ItemCard from '../components/ItemCard';
import useTemplates from '../hooks/useTemplate';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import { templateType } from '../utils/types';
import { addTemplate, deleteTemplate } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type inputs = {
  name: string;
  description: string;
};

const Templates = () => {
  const [templates, setTemplates] = useTemplates<templateType[]>();
  const [toolTipId, setToolTipId] = useState('');
  const { register, handleSubmit, reset } = useForm<inputs>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const onAddTemplateHandler = async () => {
    dialogRef.current?.showModal();
  };

  const onSetToolTip = (id: string) => {
    setToolTipId((prev: string) => (prev === id ? '' : id));
  };

  const onDeleteTemplate = (id: string) => {
    setToolTipId('');
    document.getElementById(id)?.classList.add('delete');
    deleteTemplate(id);
    setTimeout(() => {
      setTemplates((prev: templateType[]) =>
        prev.filter((template: templateType) => template.id !== id)
      );
    }, 1000);
  };

  const onSubmitAddTemplate = async (formResult: inputs) => {
    const res = await addTemplate(formResult);
    if (res.success) {
      toast.success('Template Created');
      setTemplates((prev: templateType[]) => [...prev, res.data]);
      reset();
      return;
    }
    toast.error('Add template failed');
  };


  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Templates</h2>
          <button
            onClick={() => {
              onAddTemplateHandler();
            }}
            className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] duration-300 hover:border-blue-500 w-fit"
          >
            <span className="text-blue-500 text-sm font-bold">+</span> Add
            Templates
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 gap-y-4">
          {templates.map((template) => {
            return (
              <ItemCard
                onToggleItem={() => {}}
                key={template.id}
                id={template.id}
                onClickItem={() => {
                  navigate(`/templates/${template.id}`);
                }}
                name={template.name}
                createdAt={template.createdAt}
                toolTipId={toolTipId}
                onSetToolTip={onSetToolTip}
                onDeleteItem={onDeleteTemplate}
              />
            );
          })}
        </div>
      </div>

      <Modal dialogRef={dialogRef}>
        <form
          onSubmit={handleSubmit(onSubmitAddTemplate)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold text-2xl text-center mb-1">Add Template</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-grayText">
              Name
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-grayText">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              className="border resize-none h-[72px] border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>

          <button
            onClick={() => {
              dialogRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Create Template
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Templates;
