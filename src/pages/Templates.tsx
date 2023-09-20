import { useRef, useState } from 'react';
import ItemCard from '../components/ItemCard';
import Sidebar from '../components/Sidebar';
import useTemplates from '../hooks/useTemplate';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import { templatesType } from '../utils/types';
import { addTemplate } from '../utils/helper';

type inputs = {
  name: string;
  description: string;
};

const Templates = () => {
  const [templates, setTemplates] = useTemplates<templatesType>();
  const [toolTipId, setToolTipId] = useState('');
  const { register, handleSubmit, reset } = useForm<inputs>();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onAddTemplateHandler = async () => {
    dialogRef.current?.showModal();
  };
  const onSetToolTip = (id: string) => {
    setToolTipId((prev: string) => (prev === id ? '' : id));
  };

  const onDeleteTemplate = () => {};
  const onSubmitAddTemplate = async (formResult: inputs) => {
    const res = await addTemplate(formResult);
    setTemplates((prev: templatesType) => [...prev, res.data]);
  };

  return (
    <>
      <div className="flex">
        <Sidebar active="templates" />
        <div className="lg:ml-[300px] my-[72px] py-8 grow">
          <div className="w-[85%] mx-auto flex flex-col gap-6 overflow-visible">
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
                      type="templates"
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
          </div>
        </div>
      </div>

      <Modal dialogRef={dialogRef}>
        <form
          onSubmit={handleSubmit(onSubmitAddTemplate)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">Add Template</h1>
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
