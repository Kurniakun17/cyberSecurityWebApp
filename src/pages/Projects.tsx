import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import useProjects from '../hooks/useProjects';
import { projectsType } from '../utils/types';
import { deleteProject, toggleProject } from '../utils/helper';

const Projects = () => {
  const [toolTipId, setToolTipId] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [projects, setProjects] = useProjects<projectsType[] | []>();

  const onSetToolTip = (id: string) => {
    setToolTipId((prev: string) => (prev === id ? '' : id));
  };

  const onToggleProjects = (id: string) => {
    let newProgress: string;

    setProjects((prev: projectsType[]) => {
      const newProjects = prev.map((project: projectsType) => {
        if (project.id === id) {
          newProgress =
            project.progress === 'in-progress' ? 'done' : 'in-progress';
          toggleProject(id, newProgress);
          return {
            ...project,
            progress: newProgress,
          };
        }
        return project;
      });

      return [...newProjects];
    });
    setToolTipId('');
  };

  const onDeleteProjects = async (id: string) => {
    deleteProject(id);
    setProjects((prev: projectsType[]) =>
      prev.filter((project: projectsType) => project.id !== id)
    );
  };

  if (projects === null) {
    return <div className="">null</div>;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="lg:ml-[300px] my-[72px] py-8 grow">
          <div className="w-[85%] mx-auto flex flex-col gap-6 overflow-visible ">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <h2 className="font-bold text-2xl">On-Going Projects</h2>
                <button
                  onClick={() => {
                    dialogRef.current?.showModal();
                  }}
                  className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
                >
                  <span className="text-blue-500 text-sm font-bold">+</span> Add
                  Project
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 gap-y-4">
                {projects
                  .filter(
                    (project: projectsType) =>
                      project.progress === 'in-progress'
                  )
                  .map((project: projectsType) => (
                    <ProjectCard
                      onToggleProjects={onToggleProjects}
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      createdAt={project.createdAt}
                      toolTipId={toolTipId}
                      onSetToolTip={onSetToolTip}
                      onDeleteProjects={onDeleteProjects}
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="font-bold text-2xl">Closed Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 gap-y-4">
                {projects
                  .filter(
                    (project: projectsType) => project.progress === 'done'
                  )
                  .map((project: projectsType) => (
                    <ProjectCard
                      onToggleProjects={onToggleProjects}
                      key={project.id}
                      name={project.name}
                      createdAt={project.createdAt}
                      isOpen={false}
                      id={project.id}
                      toolTipId={toolTipId}
                      onSetToolTip={onSetToolTip}
                      onDeleteProjects={onDeleteProjects}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal dialogRef={dialogRef}>
        <div className="flex flex-col gap-3 text-black">
          <h1 className="font-bold  text-2xl text-center mb-1">Add Project</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-grayText">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-grayText">
              Description
            </label>
            <textarea
              id="description"
              className="border resize-none h-[72px] border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="target-ip" className="text-grayText">
              Target IP
            </label>
            <input
              id="target-ip"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="target-url" className="text-grayText">
              Target URL
            </label>
            <input
              id="target-url"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="template" className="text-grayText">
              Template
            </label>
            <select
              id="template"
              className="px-2 py-1 focus:outline-blue-500 border background rounded-md border-[#d7d7d7]"
            >
              <option>Template 1</option>
              <option>Template 2</option>
              <option>Template 3</option>
            </select>
          </div>
          <button
            onClick={() => {
              dialogRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Create Project
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Projects;
