import { useRef } from 'react';
import Modal from './Modal';
import ChecklistModal from './ChecklistModal';
const ChecklistItem = ({
  id,
  templateId,
  title,
  progress,
  onDeleteCheckListItem,
  onToggleProgress,
}: {
  id: string;
  templateId: string;
  title: string;
  progress: number;
  onDeleteCheckListItem: (templateId: string, checklistId: string) => void;
  onToggleProgress: (
    templateId: string,
    checklistId: string,
    progress: number
  ) => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <label
        htmlFor={id}
        className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] rounded-2xl cursor-pointer"
      >
        <div className="flex gap-3 items-center">
          <input
            id={id}
            checked={Boolean(progress)}
            type="checkbox"
            className="w-[20px] h-[20px] rounded-xl"
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
              dialogRef.current?.showModal();
            }}
            className="py-1 px-4 gap-3 rounded-lg border border-[#D7D7D7]"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCheckListItem(templateId, id);
            }}
            className="py-1 px-4 gap-3 rounded-lg border border-[#D7D7D7]"
          >
            Delete
          </button>
        </div>
      </label>
      <Modal dialogRef={dialogRef} maxW="custom">
        <ChecklistModal dialogRef={dialogRef} />
      </Modal>
    </>
  );
};

export default ChecklistItem;
