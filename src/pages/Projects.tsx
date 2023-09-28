import { useState, useRef, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import useProjects from '../hooks/useProjects';
import { UserData, projectsType } from '../utils/types';
import {
  addProject,
  deleteProject,
  getTemplateList,
  toggleProject,
} from '../utils/helper';
import { useForm, useFieldArray } from 'react-hook-form';
import ItemCard from '../components/ItemCard';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/userContext';

type inputs = {
  name: string;
  description: string;
  target_ip: string[];
  target_url: string[];
  template_id: string;
};

const Projects = ({ userData }: { userData: UserData}) => {
  const [projects, setProjects] = useProjects<projectsType[] | []>();
  const [toolTipId, setToolTipId] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [template, setTemplate] = useState([]);
  const { control, register, handleSubmit, reset } = useForm<inputs>();
  const navigate = useNavigate();
  const {
    fields: target_ip,
    remove: removeTarget_ip,
    append: appendTarget_ip,
  } = useFieldArray({
    control,
    name: 'target_ip',
  });
  const {
    fields: target_url,
    remove: removeTarget_url,
    append: appendTarget_url,
  } = useFieldArray({
    control,
    name: 'target_url',
  });

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
    setToolTipId('');
    document.getElementById(id)?.classList.add('delete');
    deleteProject(id);
    setTimeout(() => {
      setProjects((prev: projectsType[]) =>
        prev.filter((project: projectsType) => project.id !== id)
      );
    }, 1000);
  };

  if (projects === null) {
    return <div className="">null</div>;
  }

  const onAddProjectHandler = async () => {
    const res = await getTemplateList();

    if (res.success) {
      const data = res.data;
      setTemplate(data.items);
      dialogRef.current?.showModal();
    }
  };

  const onSubmitAddProject = async (res: inputs) => {
    const body: inputs & { progress: string } = {
      ...res,
      target_ip: res.target_ip ?? [],
      target_url: res.target_url ?? [],
      progress: 'in-progress',
    };
    const data = await addProject(body);
    if (data.success) {
      reset();
      setProjects((prev) => {
        return [...prev, data.data];
      });
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar active="projects" userData={userData} />
        <div className="lg:ml-[300px] my-[72px] py-8 grow">
          <div className="w-[85%] mx-auto flex flex-col gap-6 overflow-visible ">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <h2 className="font-bold text-2xl">On-Going Projects</h2>
                <button
                  onClick={() => {
                    onAddProjectHandler();
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
                    <ItemCard
                      onToggleItem={onToggleProjects}
                      key={project.id}
                      id={project.id}
                      onClickItem={() => {
                        navigate(`/projects/${project.id}`);
                      }}
                      name={project.name}
                      createdAt={project.createdAt}
                      toolTipId={toolTipId}
                      onSetToolTip={onSetToolTip}
                      onDeleteItem={onDeleteProjects}
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
                    <ItemCard
                      onToggleItem={onToggleProjects}
                      key={project.id}
                      name={project.name}
                      createdAt={project.createdAt}
                      isOpen={false}
                      id={project.id}
                      onClickItem={() => {
                        navigate(`/projects/${project.id}`);
                      }}
                      toolTipId={toolTipId}
                      onSetToolTip={onSetToolTip}
                      onDeleteItem={onDeleteProjects}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal dialogRef={dialogRef}>
        <form
          onSubmit={handleSubmit(onSubmitAddProject)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">Add Project</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-grayText">
              Name
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-grayText">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              className="border resize-none h-[72px] border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="target-ip" className="text-grayText">
              Target IP
            </label>
            {target_ip.map((field, index) => {
              return (
                <div key={`target_ip-${field.id}`} className="flex gap-3">
                  <input
                    key={field.id}
                    type="text"
                    {...register(`target_ip.${index}` as const)}
                    className=""
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                    onClick={() => {
                      removeTarget_ip(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                appendTarget_ip('');
              }}
              className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
            >
              <span className="text-blue-500 text-sm font-bold">+</span> Add
              Item
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="target-url" className="text-grayText">
              Target URL
            </label>
            {target_url.map((field, index) => {
              return (
                <div key={`target_url-${field.id}`} className="flex gap-3">
                  <input
                    key={field.id}
                    type="text"
                    {...register(`target_url.${index}` as const)}
                    className=""
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                    onClick={() => {
                      removeTarget_url(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                appendTarget_url('');
              }}
              className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
            >
              <span className="text-blue-500 text-sm font-bold">+</span> Add
              Item
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="template" className="text-grayText">
              Template
            </label>
            <select
              {...register('template_id')}
              id="template"
              className="px-2 py-1 focus:outline-blue-500 border background rounded-md border-[#d7d7d7]"
            >
              {template.map((item: { name: string; id: string }) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              dialogRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Create Project
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Projects;
