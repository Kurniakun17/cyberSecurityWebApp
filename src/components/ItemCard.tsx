import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

const ItemCard = ({
  id,
  name,
  createdAt,
  toolTipId,
  type,
  onSetToolTip,
  onDeleteItem,
  onToggleItem,
  isOpen = true,
}: {
  id: string;
  name: string;
  createdAt: string;
  toolTipId: string;
  type: string;
  onSetToolTip: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  isOpen?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      id={id}
      onClick={() => {
        navigate(`/${type}/${id}`);
      }}
      className="overflow-visible relative cursor-pointer p-6 rounded-xl flex flex-col justify-between h-[132px] xl:h-[160px]  border border-[#D7D7D7]"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold">{name}</h3>
        <button
          className="font-bold cursor-pointer relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSetToolTip(id);
          }}
        >
          <MoreVertical size={'16px'} />
        </button>
      </div>
      <p className="text-[#8B879B]">Created at {createdAt.substring(0, 10)}</p>
      <div
        className={`${
          toolTipId === id ? 'flex' : 'hidden'
        }  px-5 py-3 absolute z-10 top-[-60px] right-[-100px] flex flex-col gap-3 bg-white rounded-lg border border-[#D7D7D7]`}
      >
        {isOpen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleItem(id);
            }}
            type="button"
            className="text-left"
          >
            Closed Project
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleItem(id);
            }}
            type="button"
            className="text-left"
          >
            Re-Open Project
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteItem(id);
          }}
          type="button"
          className="text-left"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
