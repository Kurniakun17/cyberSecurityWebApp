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
  UserData,
  projectDetailType,
  userCollaborator,
} from '../utils/types';
import {
  addChecklistTag,
  addChecklistTagItem,
  addCollaborator,
  deleteChecklistItem,
  deleteChecklistTag,
  exportToDocx,
  fetchChecklistDetail,
  fetchProjectDetail,
  moveChecklist,
  moveChecklistToAnotherTag,
  moveTag,
  removeCollaborator,
  toggleChecklist,
  updateChecklistTag,
  updateProject,
} from '../utils/api';
import {
  ArrowDownUp,
  Crown,
  Edit,
  FileText,
  Pencil,
  Plus,
  Trash,
  Users2,
} from 'lucide-react';
import ChecklistModal from '../components/ChecklistModal';
import { Jelly } from '@uiball/loaders';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { searchUser } from '../utils/user';
import { useDebouncedCallback } from 'use-debounce';
import toast from 'react-hot-toast';
import ModalAddTag from '../components/Modals/ModalAddTag';
import ModalAddChecklistItem from '../components/Modals/ModalAddChecklistItem';
import ModalExportDocx from '../components/Modals/ModalExportDocx';
import ModalEditTag from '../components/Modals/ModalEditTag';

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
  username: string;
  y;
};

const ProjectDetail = ({ userData }: { userData: UserData }) => {
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
    setValue,
    formState: { errors },
  } = useForm<inputs>();
  const [checklistTagId, setChecklistTagId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tagName, setTagName] = useState('');
  const [userSearchData, setUserSearchData] = useState<
    { id: string; username: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState('');
  const [userSearchId, setUserSearchId] = useState('');
  const debounced = useDebouncedCallback((username) => {
    fetchSearchUser(username);
  }, 1000);
  const [checklistDetailData, setChecklistDetailData] =
    useState<ChecklistDetailT | null>(null);

  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDetailChecklist = useRef<HTMLDialogElement>(null);
  const dialogExportToDocx = useRef<HTMLDialogElement>(null);
  const dialogEditProject = useRef<HTMLDialogElement>(null);
  const dialogEditTag = useRef<HTMLDialogElement>(null);
  const dialogMoveTag = useRef<HTMLDialogElement>(null);
  const dialogCollaborator = useRef<HTMLDialogElement>(null);

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
      setValue('publish', projectDetail.publish);
    }
  }, [projectDetail]);

  const fetchSearchUser = async (username: string) => {
    const res = await searchUser(username);
    if (res.data.success) {
      setUserSearchData(res.data.items);
    }
  };

  const onEditProjectSubmit = async (res: inputs) => {
    dialogEditProject.current?.close();
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

  const onTagModalSubmit = async (tag_name: string) => {
    dialogTagRef.current?.close();

    const result = await addChecklistTag(
      projectDetail?.template.id as string,
      tag_name
    );

    if (result.success) {
      triggerFetchProjectDetail();
    }
  };

  const onAddCollaborator = async () => {
    const res = await addCollaborator(projectDetail?.id as string, {
      collaborator_id: userSearchId,
    });
    if (res.success) {
      toast.success('Success');
      triggerFetchProjectDetail();
      setSearchValue('');
      setUserSearchId('');
      return;
    }
    toast.error('User is already a collaborator in this project');
  };

  const onRemoveCollaborator = async (
    body: { collaborator_id: string },
    index: number
  ) => {
    const res = await removeCollaborator(projectDetail?.id as string, body);

    if (res.success) {
      projectDetail?.project_user.splice(index, 1);

      setProjectDetail((prevState: projectDetailType) => ({ ...prevState }));
    }
  };

  const onExportModalSubmit = async (
    client_name: string,
    report_type: string
  ) => {
    try {
      dialogExportToDocx.current?.close();
      setLoading(true);
      await exportToDocx(projectDetail?.id as string, {
        client: client_name,
        report_type: report_type,
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
      dialogExportToDocx.current?.close();
    }
  };

  const onChecklistTagModalSubmit = async (checklist_name: string) => {
    dialogChecklistRef.current?.close();

    const res = await addChecklistTagItem(
      projectDetail?.template.id as string,
      checklistTagId,
      checklist_name
    );
    if (res.success) {
      triggerFetchProjectDetail();
      reset();
    }
  };

  const onSubmitEditTag = async (update_tag_name: string) => {
    const data = await updateChecklistTag(
      projectDetail?.template_id as string,
      checklistTagId,
      {
        name: update_tag_name,
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
      <div
        className={`flex flex-col gap-6 pb-12 ${loading && 'overflow-hidden'}`}
      >
        {loading && (
          <div className="fixed place-items-center inset-0 z-[9999] grid gap-24 justify-center bg-[rgba(255,255,255,0.9)] ">
            <div className="flex flex-col gap-12 items-center">
              <Jelly size={100} color="#3b82f6" />
              <h1 className="text-2xl text-blue-500 font-bold">
                Exporting projects to docx
              </h1>
            </div>
          </div>
        )}
        <div className="flex justify-between">
          <h2 className="text-4xl font-bold">{projectDetail.name}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                dialogEditProject.current?.showModal();
              }}
              className="group flex gap-2 relative py-2 px-3  rounded-lg border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <Edit color="#3b82f6" size={22} />
              <p className="group-hover:text-blue-500 hidden md:block">Edit</p>
              <div className="px-4 py-1 border border-blue-400 bg-white rounded-md scale-0 duration-300 group-hover:scale-100 absolute left-1/2 -translate-x-1/2 bottom-[-40px] md:hidden">
                <p>Edit</p>
              </div>
            </button>
            <button
              onClick={() => {
                dialogExportToDocx.current?.showModal();
              }}
              className="py-2 px-3 group relative flex gap-2 rounded-lg border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <FileText color="#3b82f6" />
              <p className="group-hover:text-blue-500 hidden md:block">
                Export to docx
              </p>
              <div className="px-4 py-1 w-[140px] border border-blue-400 bg-white rounded-md scale-0 duration-300 group-hover:scale-100 absolute left-1/2 -translate-x-1/2 bottom-[-40px] md:hidden">
                <p className="block">Export to docx</p>
              </div>
            </button>
            <button
              onClick={() => {
                dialogCollaborator.current?.showModal();
              }}
              className="group flex gap-2 relative py-2 px-3 rounded-lg border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <Users2 color="#3b82f6" size={22} />
              <p className="group-hover:text-blue-500 hidden md:block">
                Collaborator
              </p>
              <div className="px-4 py-1 border border-blue-400 bg-white rounded-md scale-0 duration-300 group-hover:scale-100 absolute left-1/2 -translate-x-1/2 bottom-[-40px] md:hidden">
                <p>Collaborator</p>
              </div>
            </button>
          </div>
        </div>
        <div className="flex my-4 gap-6 items-center lg:w-[500px] w-fit px-8 py-6 border mx-auto border-[#D7D7D7] rounded-2xl">
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
          <div className="flex flex-col gap-3 flex-1">
            <h3 className="text-[24px]">Vulnerability Summary</h3>

            <div className="flex">
              <div className="flex-1 flex gap-1 items-center">
                <div className="w-2 h-2 bg-purple-700 rounded-full mt-0.5"></div>
                <p>Critical - {projectDetail.critical_vuln}</p>
              </div>
              <div className="flex-1 flex gap-1 items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-0.5"></div>
                <p>High - {projectDetail.high_vuln}</p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-1 flex gap-1 items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-0.5"></div>
                <p>Medium - {projectDetail.medium_vuln}</p>
              </div>

              <div className="flex-1 flex gap-1 items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-0.5"></div>
                <p>Low - {projectDetail.low_vuln}</p>
              </div>
            </div>

            <div className="flex-1 flex gap-1 items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-0.5"></div>
              <p>Informational - {projectDetail.informational_vuln}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-5">
            <div className="border border-[#d7d7d7] py-2 px-4 rounded-lg">
              <div className="flex">
                <h3 className="font-semibold">Target URL:</h3>
                <div className="flex flex-col">
                  {projectDetail.target_url.length > 0
                    ? projectDetail.target_url.map((url: string) => (
                        <p key={url} className="ml-2">
                          - {url}
                        </p>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="border border-[#d7d7d7] py-2 px-4 rounded-lg">
              <div className="flex">
                <h3 className="font-semibold">Target IP:</h3>
                <div className="flex flex-col">
                  {projectDetail.target_ip.length > 0
                    ? projectDetail.target_ip.map((ip: string) => (
                        <p key={ip} className="ml-2">
                          - {ip}
                        </p>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <p className="block w-fit">{projectDetail.description}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              dialogMoveTag.current?.showModal();
            }}
            className="flex items-center py-2 px-3 gap-1 rounded-lg border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
          >
            <ArrowDownUp className="text-blue-500" size={20} /> Move tag
          </button>

          <button
            onClick={() => {
              dialogTagRef.current?.showModal();
            }}
            className="py-2 px-3 gap-4 rounded-lg border border-[#D7D7D7] group hover:border-blue-500 duration-300 w-fit"
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
                      setTagName(item.name);
                      setChecklistTagId(item.id);
                    }}
                  >
                    <Pencil className="text-blue-500 hover:text-blue-400 duration-300" />
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
                                  type={
                                    checklistItem.type as
                                      | 'none'
                                      | 'narrative'
                                      | 'vulnerability'
                                  }
                                  key={`checklistItem-${checklistItem.id}`}
                                  id={checklistItem.id}
                                  dialogRef={dialogDetailChecklist}
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
                        className="py-2 px-3 gap-4 duration-300 hover:border-blue-500 rounded-lg border border-[#D7D7D7] w-fit"
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
      {/* checkpoint */}
      <Modal dialogRef={dialogCollaborator}>
        <div className="flex flex-col gap-3">
          <h1 className="font-bold  text-2xl text-center mb-1">Collaborator</h1>
          {projectDetail.project_user.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`p-4 px-6 flex items-center  gap-2 border border-[#d7d7d7] duration-300 rounded-2xl`}
              >
                <div className="w-full flex justify-between">
                  <div className="flex justify-center gap-2 items-center">
                    {item.role === 'owner' ? (
                      <Crown color="#3b82f6" size={20} />
                    ) : null}
                    <p
                      className={`${
                        item.role === 'owner' && 'text-blue-500 font-semibold'
                      }`}
                    >
                      {item.user.username}
                    </p>
                  </div>
                  {((userData.id === projectDetail.project_user[0].user_id &&
                    index != 0) ||
                    userData.admin) && (
                      <button
                        onClick={() => {
                          onRemoveCollaborator(
                            {
                              collaborator_id: item.user_id,
                            },
                            index
                          );
                        }}
                        className="border border-[#d7d7d7] hover:border-red-500 duration-300 px-4 py-1 text-sm font-semibold text-red-500 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                </div>
              </div>
            );
          })}
          {(userData.id === projectDetail.project_user[0].user_id ||
            userData.admin) && (
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-lg">Add collaborator</h2>
                <div className="flex gap-3">
                  <div className="flex flex-col flex-1">
                    <input
                      type="text"
                      className="rounded-2xl h-full"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setUserSearchId('');
                        debounced(e.target.value);
                      }}
                    />
                    {userSearchData.map((data, index) => (
                      <button
                        onClick={() => {
                          setUserSearchId(data.id);
                          setSearchValue(data.username);
                          setUserSearchData([]);
                        }}
                        key={data.id}
                        className={`p-2  hover:border-blue-500 ${
                          userSearchId === data.id ? 'border-blue-500' : ''
                        } duration-300 text-start border-x ${
                          index == userSearchData.length - 1
                            ? 'border-b rounded-b-lg'
                            : ''
                        } border-gray-300 cursor-pointer `}
                        type="button"
                      >
                        <h3>{data.username}</h3>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={onAddCollaborator}
                    disabled={userSearchId === '' ? true : false}
                    className="h-fit py-2 px-3 gap-1 items-center disabled:bg-slate-300 disabled:opacity-40 flex  text-sm group rounded-lg border border-[#D7D7D7] hover:border-transparent hover:bg-blue-500 hover:text-white duration-300 w-fit"
                  >
                    <Plus
                      size={16}
                      className="text-blue-500 group-hover:text-white duration-300"
                    />
                    Add
                  </button>
                </div>
              </div>
            )}
          <button
            onClick={() => {
              dialogCollaborator.current?.close();
            }}
            type="button"
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 hover:bg-blue-400 duration-300 font-bold  text-white py-2"
          >
            Close
          </button>
        </div>
      </Modal>

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
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 hover:bg-blue-400 duration-300 font-bold  text-white py-2"
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

      <ModalEditTag
        onSubmitEditTag={onSubmitEditTag}
        dialogEditTag={dialogEditTag}
        defaultValue={tagName}
      />

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
              {...register('name', { required: true })}
              id="name"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errors.name?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-grayText">
              Description
            </label>
            <textarea
              {...register('description', { required: true })}
              id="description"
              className="border resize-none h-[72px] border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errors.description?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="target-ip" className="text-grayText">
              Target IP
            </label>
            {target_ip.map((field, index) => {
              return (
                <div key={`target_ip-${field.id}`}>
                  <div className="flex gap-3">
                    <input
                      key={field.id}
                      type="text"
                      {...register(`target_ip.${index}` as const, {
                        required: true,
                      })}
                      className=""
                    />
                    <button
                      type="button"
                      className="px-4 py-2 border border-[#d7d7d7] rounded-md"
                      onClick={() => {
                        removeTarget_ip(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {errors.target_ip?.[index]?.type === 'required' && (
                    <p className="text-red-500">Please fill out this field</p>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                appendTarget_ip('');
              }}
              className="py-2 px-3 gap-4  text-sm rounded-lg border border-[#D7D7D7] w-fit"
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
                    className="px-4 py-2 border border-[#d7d7d7] rounded-lg"
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
              className="py-2 px-3 gap-4  text-sm rounded-lg border border-[#D7D7D7] w-fit"
            >
              <span className="text-blue-500 text-sm font-bold">+</span> Add
              Item
            </button>
          </div>

          <button className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2">
            Save
          </button>
        </form>
      </Modal>

      {/* Modal Add Tag */}
      <ModalAddTag
        dialogTagRef={dialogTagRef}
        onTagModalSubmit={onTagModalSubmit}
      />

      {/* Modal Add Checklist Tag */}

      <ModalAddChecklistItem
        dialogChecklistRef={dialogChecklistRef}
        onChecklistTagModalSubmit={onChecklistTagModalSubmit}
      />

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
        />
      </Modal>

      <ModalExportDocx
        dialogExportToDocx={dialogExportToDocx}
        onExportModalSubmit={onExportModalSubmit}
      />
    </>
  );
};

export default ProjectDetail;
