import { useEffect, useRef, useState } from 'react';
import ChecklistItem from '../components/ChecklistItem';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import useProjectDetail from '../hooks/useProjectDetail';
import Modal from '../components/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChecklistItemType, projectDetailType } from '../utils/types';
import {
  addChecklistTag,
  addChecklistTagItem,
  deleteChecklistItem,
  deleteChecklistTag,
  toggleChecklist,
} from '../utils/helper';
import { Trash } from 'lucide-react';

type inputs = {
  tag_name: string;
  checklist_name: string;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, triggerFetchProjectDetail] =
    useProjectDetail<projectDetailType>(id as string);
  const { register, handleSubmit } = useForm<inputs>();
  const [checklistTagId, setChecklistTagId] = useState('');
  const [checklistItemId] = useState('');
  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDeleteChecklist = useRef<HTMLDialogElement>(null);

  useEffect(() => {}, []);

  const onTagModalSubmit: SubmitHandler<inputs> = async (data) => {
    console.log(data);
    const result = await addChecklistTag(
      projectDetail?.template.id as string,
      data.tag_name
    );

    if (result.success) {
      triggerFetchProjectDetail();
    }
  };

  const onChecklistModalSubmit: SubmitHandler<inputs> = async (data) => {
    console.log(data);
    const res = await addChecklistTagItem(
      projectDetail?.template.id as string,
      checklistTagId,
      data.checklist_name
    );
    if (res.success) {
      triggerFetchProjectDetail();
    }
  };

  const onDeleteCheckListItem = async (
    templateId: string,
    checklistItemId: string
  ) => {
    const res = await deleteChecklistItem(templateId, checklistItemId);
    if (res.success) {
      triggerFetchProjectDetail();
    }
  };

  const onDeleteTag = async (templateId: string, tagId: string) => {
    const res = await deleteChecklistTag(templateId, tagId);
    dialogDeleteTag.current?.close();
    if (res.success) {
      triggerFetchProjectDetail();
    }
  };

  const onToggleProgress = async (
    templateId: string,
    checklistId: string,
    progress: number
  ) => {
    progress = progress ? 0 : 1;
    const res = await toggleChecklist(templateId, checklistId, progress);
    if (res.success) {
      triggerFetchProjectDetail();
    }
  };

  if (!projectDetail) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="pt-8 grow lg:ml-[300px] my-[72px]">
          <div className="w-[85%]  mx-auto flex flex-col gap-6 ">
            <h2 className="text-4xl font-bold">{projectDetail.name}</h2>
            <div className="flex gap-6 w-fit items-center px-8 py-6 border mx-auto border-[#D7D7D7] rounded-2xl">
              <div className="flex flex-col gap-3">
                <span className="font-bold text-[32px]">
                  {Number.isNaN(
                    projectDetail.done_checklist / projectDetail.total_checklist
                  )
                    ? 0
                    : Math.floor(
                        (projectDetail.done_checklist /
                          projectDetail.total_checklist) *
                          100
                      ).toString()}
                  %
                </span>
                <p className="text-center">
                  {projectDetail.done_checklist}/{projectDetail.total_checklist}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-[24px]">Vulnerability Summary</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>High - {projectDetail.high_vuln}</td>
                      <td>Low - {projectDetail.low_vuln}</td>
                    </tr>
                    <tr>
                      <td>Medium - {projectDetail.medium_vuln}</td>
                      <td>
                        Informational - {projectDetail.informational_vuln}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-semibold">
                Target URL: {projectDetail.target_url}
              </p>
              <p className="block w-fit">{projectDetail.description}</p>
            </div>
            <button
              onClick={() => {
                dialogTagRef.current?.showModal();
              }}
              className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] w-fit"
            >
              <span className="text-blue-500 text-lg font-bold">+</span> Add
              checklist tag
            </button>
            {projectDetail.template.checklist_tag.map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <h4 className="text-2xl">{item.name}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dialogDeleteTag.current?.showModal();
                      setChecklistTagId(item.id);
                    }}
                  >
                    <Trash />
                  </button>
                </div>
                <div className="flex flex-col pl-4 gap-3">
                  {item.checklist.map((checklistItem: ChecklistItemType) => (
                    <ChecklistItem
                      key={`checklistItem-${checklistItem.id}`}
                      id={checklistItem.id}
                      templateId={projectDetail.template.id}
                      title={checklistItem.title}
                      progress={checklistItem.progress}
                      onToggleProgress={onToggleProgress}
                      onDeleteCheckListItem={onDeleteCheckListItem}
                    />
                  ))}
                  <button
                    onClick={() => {
                      setChecklistTagId(item.id);
                      dialogChecklistRef.current?.showModal();
                    }}
                    className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] w-fit"
                  >
                    <span className="text-blue-500 text-lg font-bold">+</span>{' '}
                    Add checklist item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal dialogRef={dialogTagRef}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onTagModalSubmit)}
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Add Checklist Tag
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Name</label>
            <input type="text" {...register('tag_name')} />
          </div>
          <button
            onClick={() => {
              dialogTagRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Create Checklist Tag
          </button>
        </form>
      </Modal>
      <Modal dialogRef={dialogChecklistRef}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onChecklistModalSubmit)}
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Add Checklist Item
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Name</label>
            <input type="text" {...register('checklist_name')} />
          </div>
          <button
            onClick={() => {
              dialogChecklistRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Create Checklist Item
          </button>
        </form>
      </Modal>
      <Modal dialogRef={dialogDeleteTag}>
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-red-500 text-2xl text-center ">
            Delete Checklist Tag
          </h1>
          <p>
            Are you sure you want to delete this tag? (All of the checklist that
            exist on this tag would also be deleted)
          </p>
          <div className="flex gap-6">
            <button
              className="w-full py-2 bg-gray-500 text-white rounded-md"
              onClick={() => {
                dialogDeleteTag.current?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="w-full py-2 bg-red-500 rounded-md text-white"
              onClick={() => {
                onDeleteTag(projectDetail.template.id, checklistTagId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal dialogRef={dialogDeleteChecklist}>
        <div className="flex flex-col gap-8">
          <h1 className="font-bold text-red-500 text-2xl text-center ">
            Delete Checklist Item
          </h1>
          <p>
            Are you sure you want to delete this tag? (All of the data that
            exist on this checklist would also be deleted)
          </p>
          <div className="flex gap-6">
            <button
              className="w-full py-2 bg-gray-500 text-white rounded-md"
              onClick={() => {
                dialogDeleteTag.current?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="w-full py-2 bg-red-500 rounded-md text-white"
              onClick={() => {
                onDeleteCheckListItem(
                  projectDetail.template.id,
                  checklistItemId
                );
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectDetail;
