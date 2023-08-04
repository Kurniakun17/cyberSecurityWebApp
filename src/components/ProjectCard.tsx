import { useNavigate } from 'react-router-dom';

const ProjectCard = ({
  index,
  toolTipIndex,
  onSetToolTip,
}: {
  index: number;
  toolTipIndex: number;
  onSetToolTip: (index: number) => void;
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
          className="font-bold px-4 cursor-pointer"
          onClick={() => {
            onSetToolTip(index);
          }}
        >
          ...
        </button>
      </div>
      <p className="text-[#8B879B]">Created at 2023-07-10</p>
      <div
        className={`${
          toolTipIndex === index ? 'flex' : 'hidden'
        }  px-5 py-3 absolute z-[2] top-[-60px] right-[-60px] flex flex-col gap-3 bg-white rounded-lg border border-[#D7D7D7]`}
      >
        <button type="button" className="text-left">
          Closed Project
        </button>
        <button type="button" className="text-left">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
