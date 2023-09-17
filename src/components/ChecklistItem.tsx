import React from 'react';
import Modal from './Modal';
import { DraggableProvided } from 'react-beautiful-dnd';
// import Modal from './Modal';
// import ChecklistModal from './ChecklistModal';
const ChecklistItem = ({
  id,
  templateId,
  title,
  progress,
  dialogRef,
  dialogDeleteChecklist,
  onDeleteCheckListItem,
  onToggleProgress,
  onModalOpen,
  provided,
}: {
  id: string;
  templateId: string;
  title: string;
  progress: number;
  dialogRef: React.RefObject<HTMLDialogElement>;
  dialogDeleteChecklist: React.RefObject<HTMLDialogElement>;
  onDeleteCheckListItem: (templateId: string, checklistId: string) => void;
  onToggleProgress: (
    templateId: string,
    checklistId: string,
    progress: number
  ) => void;
  onModalOpen: (checklistId: string, templateId: string) => void;
  triggerFetchProjectDetail: () => void;
  provided: DraggableProvided;
}) => {
  return (
    <>
      <label
        htmlFor={id}
        className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        <div className="flex gap-3 items-center">
          <input
            id={id}
            checked={Boolean(progress)}
            type="checkbox"
            className="w-[20px] h-[20px] rounded-xl hover:cursor-pointer"
            onChange={() => {
              onToggleProgress(templateId, id, progress);
            }}
          />
          <p>{title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onModalOpen(id, templateId);
              dialogRef.current?.showModal();
            }}
            className="py-1 px-4 gap-3 rounded-lg hover:border-yellow-500 hover:text-yellow-500 duration-300 border border-[#D7D7D7]"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dialogDeleteChecklist.current?.showModal();
            }}
            className="py-1 px-4 gap-3 rounded-lg border hover:border-red-500 hover:text-red-500 duration-300 border-[#D7D7D7]"
          >
            Delete
          </button>
        </div>
      </label>
      <Modal dialogRef={dialogDeleteChecklist}>
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-red-500 text-2xl text-center ">
            Delete Checklist Item
          </h1>
          <p>
            Are you sure you want to delete this checklist item? (All of the
            data that exist on this checklist would also be deleted)
          </p>
          <div className="flex gap-6">
            <button
              className="w-full py-2 bg-gray-500 text-white rounded-md"
              onClick={() => {
                dialogDeleteChecklist.current?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="w-full py-2 bg-red-500 rounded-md text-white"
              onClick={() => {
                onDeleteCheckListItem(templateId, id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChecklistItem;
