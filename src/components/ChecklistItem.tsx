import { useRef } from 'react';
import Modal from './Modal';
import ChecklistModal from './ChecklistModal';
const ChecklistItem = ({
  id,
  onDeleteCheckListItem,
}: {
  id: number;
  onDeleteCheckListItem: (id: number) => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <label
        htmlFor="check"
        className="ml-6 p-4 px-8 flex items-center justify-between border border-[#D7D7D7] rounded-2xl cursor-pointer"
      >
        <div className="flex gap-3 items-center">
          <input
            id="check"
            type="checkbox"
            className="w-[20px] h-[20px] rounded-xl"
          />
          <p>Penetration Link</p>
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
            onClick={() => {
              onDeleteCheckListItem(id);
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
