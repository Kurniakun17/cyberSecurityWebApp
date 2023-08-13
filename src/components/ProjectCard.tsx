import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

const ProjectCard = ({
  id,
  toolTipId,
  onSetToolTip,
  onDeleteProjects,
  isOpen = true,
}: {
  id: string;
  toolTipId: string;
  onSetToolTip: (id: string) => void;
  onDeleteProjects: (id: string) => void;
  isOpen?: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate('/projects/id');
      }}
      className="relative cursor-pointer p-6 rounded-xl flex flex-col justify-between h-[132px] xl:h-[160px]  border border-[#D7D7D7]"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Kemdikbud Pentest</h3>
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
      <p className="text-[#8B879B]">Created at 2023-07-10</p>
      <div
        className={`${
          toolTipId === id ? 'flex' : 'hidden'
        }  px-5 py-3 absolute z-10 top-[-60px] right-[-100px] flex flex-col gap-3 bg-white rounded-lg border border-[#D7D7D7]`}
      >
        {isOpen ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
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
            onDeleteProjects(id);
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

export default ProjectCard;
