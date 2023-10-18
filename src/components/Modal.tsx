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
        clickOutsideModal(e);
      }}
      className={`rounded-xl w-[90%] sm:w-[85%] ${
        maxW === 'default' ? 'w-fit' : 'w-fit'
      } max-h-[700px] max-w-[947px] overflow-scroll no-scrollbar`}
      ref={dialogRef}
      id="dialog"
    >
      <div id="modalBody" className="p-12 py-10 rounded-xl shadow-md">
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
