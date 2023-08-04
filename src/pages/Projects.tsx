import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [toolTipIndex, setToolTipIndex] = useState(-1);

  const onSetToolTip = (index: number) => {
    setToolTipIndex((prev: number) => (prev === index ? -1 : index));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="pt-8 grow">
        <div className="w-[85%] mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl">On-Going Projects</h2>
            <div className="grid grid-cols-3 gap-6 gap-y-4">
              {['a', 'b', 'c', 'd'].map((_, index: number) => (
                <ProjectCard
                  key={index}
                  index={index}
                  toolTipIndex={toolTipIndex}
                  onSetToolTip={onSetToolTip}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-2xl">Closed Projects</h2>
            <div className="grid grid-cols-3 gap-6 gap-y-4">
              {['a', 'b', 'c', 'd'].map((_, index: number) => (
                <ProjectCard
                  key={index}
                  index={index}
                  toolTipIndex={toolTipIndex}
                  onSetToolTip={onSetToolTip}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
