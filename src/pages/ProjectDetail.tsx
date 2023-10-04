import { useEffect, useRef, useState } from 'react';
import ChecklistItem from '../components/ChecklistItem';
import { useParams } from 'react-router-dom';
import useProjectDetail from '../hooks/useItemDetail';
import Modal from '../components/Modal';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import {
  ChecklistDetailT,
  ChecklistItemType,
  ChecklistTag,
  projectDetailType,
} from '../utils/types';
import {
  addChecklistTag,
  addChecklistTagItem,
  deleteChecklistItem,
  deleteChecklistTag,
  exportToDocx,
  fetchChecklistDetail,
  fetchProjectDetail,
  moveChecklist,
  moveChecklistToAnotherTag,
  moveTag,
  toggleChecklist,
  updateChecklistTag,
  updateProject,
} from '../utils/helper';
import { ArrowDownUp, Edit, FileText, Pencil, Trash } from 'lucide-react';
import ChecklistModal from '../components/ChecklistModal';
import { Jelly } from '@uiball/loaders';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

type inputs = {
  update_tag_name: string;
  tag_name: string;
  checklist_name: string;
  client_name: string;
  report_type: string;
  name: string;
  description: string;
  target_ip: string[];
  target_url: string[];
  progress: string;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, setProjectDetail, triggerFetchProjectDetail] =
    useProjectDetail<projectDetailType>(async () => {
      return await fetchProjectDetail(id as string);
    });
  const {
    control,
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
  } = useForm<inputs>();
  const [checklistTagId, setChecklistTagId] = useState('');
  const [loading, setLoading] = useState(false);

  const [checklistDetailData, setChecklistDetailData] =
    useState<ChecklistDetailT | null>(null);

  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDeleteChecklist = useRef<HTMLDialogElement>(null);
  const dialogDetailChecklist = useRef<HTMLDialogElement>(null);
  const dialogExportToDocx = useRef<HTMLDialogElement>(null);
  const dialogEditProject = useRef<HTMLDialogElement>(null);
  const dialogEditTag = useRef<HTMLDialogElement>(null);
  const dialogMoveTag = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    if (projectDetail != null) {
      setValue('name', projectDetail?.name);
      setValue('description', projectDetail.description);
      setValue('target_ip', projectDetail.target_ip);
      setValue('target_url', projectDetail.target_url);
    }
  }, [projectDetail]);

  const onEditProjectSubmit = async (res: inputs) => {
    const fetchResult = await updateProject(projectDetail?.id as string, res);
    if (fetchResult.success) {
      triggerFetchProjectDetail();
      reset();
    }
  };

  const asyncFetchChecklistDetail = async (
    checklistId: string,
    templateId: string
  ) => {
    const res = await fetchChecklistDetail(checklistId, templateId);
    setChecklistDetailData(res.data);
  };

  const onTagModalSubmit: SubmitHandler<inputs> = async (data) => {
    const result = await addChecklistTag(
      projectDetail?.template.id as string,
      data.tag_name
    );

    if (result.success) {
      triggerFetchProjectDetail();
      reset();
    }
  };

  const onExportModalSubmit: SubmitHandler<inputs> = async (data) => {
    try {
      dialogExportToDocx.current?.close();
      setLoading(true);
      await exportToDocx(projectDetail?.id as string, {
        client: data.client_name,
        report_type: data.report_type,
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onChecklistTagModalSubmit: SubmitHandler<inputs> = async (data) => {
    resetField('checklist_name');
    const res = await addChecklistTagItem(
      projectDetail?.template.id as string,
      checklistTagId,
      data.checklist_name
    );
    if (res.success) {
      triggerFetchProjectDetail();
      reset();
    }
  };

  const onSubmitEditTag = async (res: inputs) => {
    const data = await updateChecklistTag(
      projectDetail?.template_id as string,
      checklistTagId,
      {
        name: res.update_tag_name,
      }
    );

    if (data.success) {
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
      reset();
    }
  };

  const onDeleteTag = async (templateId: string, tagId: string) => {
    const res = await deleteChecklistTag(templateId, tagId);
    dialogDeleteTag.current?.close();
    if (res.success) {
      triggerFetchProjectDetail();
      reset();
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

  function dragEndHandler(result: DropResult) {
    if (!result.destination) return;
    const { destination, source } = result;
    const temp = Array.from(
      projectDetail?.template.checklist_tag as ChecklistTag[]
    );
    const destTagIndex = temp.map((e) => e.id).indexOf(destination.droppableId);

    if (destination.droppableId === source.droppableId) {
      const [reorderedItem] = temp[destTagIndex].checklist.splice(
        source.index,
        1
      );
      temp[destTagIndex].checklist.splice(destination.index, 0, reorderedItem);

      temp[destTagIndex].checklist.forEach((ele, index) => {
        ele.priority = index;
      });
      setProjectDetail(
        (prev) =>
          ({
            ...prev,
            template: { ...prev?.template, checklist_tag: temp },
          } as projectDetailType)
      );

      moveChecklist({
        templateId: projectDetail?.template_id as string,
        body: temp[destTagIndex],
      });
      return;
    }
    const sourceTagIndex = temp.map((e) => e.id).indexOf(source.droppableId);

    const [reorderedItem] = temp[sourceTagIndex].checklist.splice(
      source.index,
      1
    );

    temp[sourceTagIndex].checklist.forEach((ele, index) => {
      ele.priority = index;
    });

    reorderedItem.priority = temp[destTagIndex].checklist.length - 1;
    temp[destTagIndex].checklist.push(reorderedItem);
    setProjectDetail(
      (prev) =>
        ({
          ...prev,
          template: { ...prev?.template, checklist_tag: temp },
        } as projectDetailType)
    );

    moveChecklistToAnotherTag({
      templateId: projectDetail?.template_id as string,
      body: {
        target_tag_id: temp[destTagIndex].id,
        checklist_id: reorderedItem.id,
      },
    });
  }

  async function dragEndTagHandler(result: DropResult) {
    const { destination, source } = result;
    const temp = Array.from(
      projectDetail?.template.checklist_tag as ChecklistTag[]
    );

    const [reorderedItem] = temp.splice(source.index, 1);

    temp.splice(destination?.index as number, 0, reorderedItem);

    temp.forEach((item: ChecklistTag, index: number) => {
      item.priority = index;
    });

    setProjectDetail(
      (prev) =>
        ({
          ...prev,
          template: { ...prev?.template, checklist_tag: temp },
        } as projectDetailType)
    );

    const body = {
      checklist_tag: temp,
    };

    moveTag({
      templateId: projectDetail?.template_id as string,
      body: body,
    });
  }

  if (!projectDetail) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className={`flex flex-col gap-6 ${loading && 'overflow-hidden'}`}>
        {loading && (
          <div className="fixed z-[9999] flex flex-col gap-24 justify-center items-center h-screen w-screen bg-[rgba(255,255,255,0.9)] ">
            <Jelly size={100} color="#3b82f6" />
            <h1 className="text-2xl text-blue-500 font-bold">
              Exporting projects to docx...
            </h1>
          </div>
        )}
        <div className="flex justify-between">
          <h2 className="text-4xl font-bold">{projectDetail.name}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                dialogEditProject.current?.showModal();
              }}
              className="group flex gap-2 relative py-2 px-3  rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <Edit color="#3b82f6" size={22} />
              <p className="group-hover:text-blue-500">Edit</p>
            </button>
            <button
              onClick={() => {
                dialogExportToDocx.current?.showModal();
              }}
              className="py-2 px-3 group flex gap-2 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <FileText color="#3b82f6" />
              <p className="group-hover:text-blue-500">Export to docx</p>
            </button>
          </div>
        </div>
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
                  <td>Informational - {projectDetail.informational_vuln}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-5">
            <div className="border border-[#d7d7d7] py-2 px-4 rounded-xl">
              <p className="font-semibold block flex-1 text-center">
                Target URL:{' '}
                {projectDetail.target_url.length > 0
                  ? projectDetail.target_url.toString()
                  : '-'}
              </p>
            </div>
            <div className="border border-[#d7d7d7] py-2 px-4 rounded-xl">
              <p className="font-semibold block flex-1 text-center">
                Target IP:{' '}
                {projectDetail.target_ip.length > 0
                  ? projectDetail.target_ip.toString()
                  : '-'}
              </p>
            </div>
          </div>
          <p className="block w-fit">{projectDetail.description}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              dialogMoveTag.current?.showModal();
            }}
            className="flex items-center py-2 px-3 gap-1 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
          >
            <ArrowDownUp className="text-blue-500" size={20} /> Move tag
          </button>

          <button
            onClick={() => {
              dialogTagRef.current?.showModal();
            }}
            className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
          >
            <span className="text-blue-500 text-lg font-bold">+</span> Add
            checklist tag
          </button>
        </div>

        <DragDropContext onDragEnd={dragEndHandler}>
          {projectDetail.template.checklist_tag.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h4 className="text-2xl">{item.name}</h4>
                <div className="flex gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dialogEditTag.current?.showModal();
                      setValue('update_tag_name', item.name);
                      setChecklistTagId(item.id);
                    }}
                  >
                    <Pencil className="text-blue-500 duration-300" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dialogDeleteTag.current?.showModal();
                      setChecklistTagId(item.id);
                    }}
                  >
                    <Trash className="text-red-500 duration-300 hover:text-red-400" />
                  </button>
                </div>
              </div>
              <Droppable droppableId={item.id}>
                {(provided) => {
                  return (
                    <div
                      className="flex flex-col pl-4 gap-3"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {item.checklist.map(
                        (checklistItem: ChecklistItemType, index: number) => (
                          <Draggable
                            key={checklistItem.id}
                            draggableId={checklistItem.id}
                            index={index}
                          >
                            {(provided) => {
                              return (
                                <ChecklistItem
                                  provided={provided}
                                  key={`checklistItem-${checklistItem.id}`}
                                  id={checklistItem.id}
                                  dialogRef={dialogDetailChecklist}
                                  dialogDeleteChecklist={dialogDeleteChecklist}
                                  templateId={projectDetail.template.id}
                                  title={checklistItem.title}
                                  progress={checklistItem.progress}
                                  onToggleProgress={onToggleProgress}
                                  onDeleteCheckListItem={onDeleteCheckListItem}
                                  onModalOpen={asyncFetchChecklistDetail}
                                />
                              );
                            }}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                      <button
                        onClick={() => {
                          setChecklistTagId(item.id);
                          dialogChecklistRef.current?.showModal();
                        }}
                        className="py-2 px-3 gap-4 duration-300 hover:border-blue-500 rounded-xl border border-[#D7D7D7] w-fit"
                      >
                        <span className="text-blue-500 text-lg font-bold">
                          +
                        </span>{' '}
                        Add checklist item
                      </button>
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>

      <Modal dialogRef={dialogMoveTag}>
        <form
          onSubmit={handleSubmit(onSubmitEditTag)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Move Checklist Tag
          </h1>

          <DragDropContext onDragEnd={dragEndTagHandler}>
            <Droppable droppableId="checklistTag">
              {(provided) => {
                return (
                  <div
                    className="flex flex-col gap-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {projectDetail.template.checklist_tag.map(
                      (item, index: number) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(providedDraggable) => {
                              return (
                                <div
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  ref={providedDraggable.innerRef}
                                  className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
                                >
                                  <h1>{item.name}</h1>
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      }
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>

          <button
            onClick={() => {
              dialogMoveTag.current?.close();
            }}
            type="button"
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Close
          </button>
        </form>
      </Modal>

      <Modal dialogRef={dialogEditTag}>
        <form
          onSubmit={handleSubmit(onSubmitEditTag)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Edit Checklist Tag
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="checklistTag" className="text-grayText">
              Tag name
            </label>
            <input
              {...register('update_tag_name')}
              id="checklistTag"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
          </div>
          <button
            onClick={() => {
              dialogEditTag.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal dialogRef={dialogEditProject}>
        <form
          onSubmit={handleSubmit(onEditProjectSubmit)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">Edit Project</h1>
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

          <button
            onClick={() => {
              dialogEditProject.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Create Project
          </button>
        </form>
      </Modal>

      {/* Modal Add Tag */}
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

      {/* Modal Add Checklist Tag */}
      <Modal dialogRef={dialogChecklistRef}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onChecklistTagModalSubmit)}
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

      {/* Modal Delete Tag */}
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

      {/* Modal Checklist Detail */}
      <Modal dialogRef={dialogDetailChecklist} maxW="custom">
        <ChecklistModal
          dialogRef={dialogDetailChecklist}
          data={checklistDetailData}
          templateId={projectDetail.template_id}
          triggerFetchProjectDetail={triggerFetchProjectDetail}
          asyncFetchChecklistDetail={asyncFetchChecklistDetail}
        />
      </Modal>

      <Modal dialogRef={dialogExportToDocx}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onExportModalSubmit)}
        >
          <h1 className="font-bold text-blue-500 text-2xl text-center mb-1">
            Export project to Docx
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Client Name</label>
            <input
              placeholder="PT ABC"
              type="text"
              {...register('client_name')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Report Type</label>
            <input
              placeholder="Early Report Web App ABC"
              type="text"
              {...register('report_type')}
            />
          </div>
          <button
            onClick={() => {
              dialogChecklistRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Create docx
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ProjectDetail;
