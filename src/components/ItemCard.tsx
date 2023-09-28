import { MoreVertical } from 'lucide-react';

const ItemCard = ({
  id,
  name,
  createdAt,
  toolTipId,
  onSetToolTip,
  onDeleteItem,
  onToggleItem,
  onClickItem,
  isOpen = true,
}: {
  id: string;
  name: string;
  createdAt: string;
  toolTipId: string;

  onSetToolTip: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onToggleItem: (id: string) => void;
  onClickItem: () => void;
  isOpen?: boolean;
}) => {
  return (
    <div
      id={id}
      onClick={onClickItem}
      className="overflow-visible relative cursor-pointer p-6 rounded-xl flex flex-col justify-between h-[132px] xl:h-[160px]  border border-[#D7D7D7] hover:border-blue-500 group duration-300"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold group-hover:text-blue-500 duration-300">
          {name}
        </h3>
        <button
          className="font-bold cursor-pointer relative z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSetToolTip(id);
          }}
        >
          <MoreVertical
            size={'16px'}
            className="group-hover:text-blue-500 duration-300"
          />
        </button>
      </div>
      <p className="text-[#8B879B] group-hover:text-blue-500/80 duration-300">
        Created at {createdAt.substring(0, 10)}
      </p>
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
          className="text-left hover:text-red-500 duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
