import { X } from 'lucide-react';
import React, { ReactNode } from 'react';

const Modal = ({
  dialogRef,
  children,
  maxW = 'default',
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  children: ReactNode;
  maxW?: string;
}) => {
  const clickOutsideModal = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    const id = (e.target as HTMLInputElement).id;
    if (id === 'dialog') dialogRef.current?.close();
  };

  return (
    <dialog
      onClick={(e) => {
        if (maxW === 'default') {
          clickOutsideModal(e);
        }
      }}
      className={`w-[80%] rounded-xl ${
        maxW === 'default' ? 'max-w-[648px]' : 'w-[90%] sm:w-[85%]'
      } h-fit max-h-[85%] overflow-scroll no-scrollbar`}
      ref={dialogRef}
      id="dialog"
    >
      <div id="modalBody" className="p-12 py-10 rounded-xl shadow-md">
        <div className="flex justify-end">
          {maxW !== 'default' && (
            <button onClick={() => dialogRef.current?.close()}>
              <X
                size={32}
                className="font-bold text-red-500 hover:text-red-300 duration-300"
              />
            </button>
          )}
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
