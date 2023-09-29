import { useParams } from 'react-router-dom';
import useItemDetail from '../hooks/useItemDetail';
import {
  addChecklistTag,
  addChecklistTagItem,
  deleteChecklistItem,
  deleteChecklistTag,
  fetchChecklistDetail,
  fetchTemplateDetail,
  moveChecklist,
  moveChecklistToAnotherTag,
  toggleChecklist,
  updateChecklistItem,
  updateTemplate,
} from '../utils/helper';
import {
  ChecklistDetailT,
  ChecklistItemType,
  ChecklistTag,
  templateDetailType,
} from '../utils/types';
import { useEffect, useRef } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { Edit, Trash } from 'lucide-react';
import ChecklistItem from '../components/ChecklistItem';
import { useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import Modal from '../components/Modal';

type inputs = {
  tag_name: string;
  checklist_name: string;
  client_name: string;
  report_type: string;
  title: string;
  description: string;
  template_description: string;
  type: string;
  name: string;
  target_ip: string[];
  target_url: string[];
};

const TemplateDetail = () => {
  const { id } = useParams();
  const [templateDetail, setTemplateDetail, triggerFetchTemplateDetail] =
    useItemDetail<templateDetailType>(async () => {
      return await fetchTemplateDetail(id as string);
    });
  const [checklistTagId, setChecklistTagId] = useState('');
  const { control, register, reset, resetField, handleSubmit, setValue } =
    useForm<inputs>();
  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDeleteChecklist = useRef<HTMLDialogElement>(null);
  const dialogDetailChecklist = useRef<HTMLDialogElement>(null);
  const [checklistDetailData, setChecklistDetailData] =
    useState<ChecklistDetailT | null>(null);
  const dialogEditProject = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (checklistDetailData) {
      setValue('title', checklistDetailData.title);
      setValue('description', checklistDetailData.title);
      setValue('type', checklistDetailData.title);
    }
  }, [checklistDetailData, setValue]);

  useEffect(() => {
    if (templateDetail != null) {
      setValue('name', templateDetail?.name as string);

      setValue('template_description', templateDetail?.description as string);
      setValue('target_ip', templateDetail?.target_ip as string[]);
      setValue('target_url', templateDetail?.target_url as string[]);
    }
  }, [templateDetail]);

  const onEditProjectSubmit = async (result: inputs) => {
    const res = {
      name: result.name,
      description: result.template_description,
      target_url: result.target_url,
      target_ip: result.target_ip,
      progress: 'in-progress',
    };
    const fetchResult = await updateTemplate(templateDetail?.id as string, res);
    if (fetchResult.success) {
      triggerFetchTemplateDetail();
      reset();
    }
  };

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

  const onToggleProgress = async (
    templateId: string,
    checklistId: string,
    progress: number
  ) => {
    progress = progress ? 0 : 1;
    const res = await toggleChecklist(templateId, checklistId, progress);
    if (res.success) {
      triggerFetchTemplateDetail();
    }
  };

  const onTagModalSubmit: SubmitHandler<inputs> = async (data) => {
    const result = await addChecklistTag(
      templateDetail?.id as string,
      data.tag_name
    );

    if (result.success) {
      triggerFetchTemplateDetail();
      reset();
    }
  };

  const onDeleteTag = async (templateId: string, tagId: string) => {
    const res = await deleteChecklistTag(templateId, tagId);
    dialogDeleteTag.current?.close();
    if (res.success) {
      triggerFetchTemplateDetail();
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

  function dragEndHandler(result: DropResult) {
    if (!result.destination) return;
    const { destination, source } = result;
    const temp = Array.from(templateDetail?.checklist_tag as ChecklistTag[]);
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
      setTemplateDetail(
        (prev) =>
          ({
            ...prev,
            checklist_tag: temp,
          } as templateDetailType)
      );

      moveChecklist({
        templateId: templateDetail?.id as string,
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
    setTemplateDetail(
      (prev) =>
        ({
          ...prev,
          checklist_tag: temp,
        } as templateDetailType)
    );

    moveChecklistToAnotherTag({
      templateId: templateDetail?.id as string,
      body: {
        target_tag_id: temp[destTagIndex].id,
        checklist_id: reorderedItem.id,
      },
    });
  }
  const onChecklistTagModalSubmit: SubmitHandler<inputs> = async (data) => {
    resetField('checklist_name');
    const res = await addChecklistTagItem(
      templateDetail?.id as string,
      checklistTagId,
      data.checklist_name
    );
    if (res.success) {
      triggerFetchTemplateDetail();
      reset();
    }
  };

  const onDeleteCheckListItem = async (
    templateId: string,
    checklistItemId: string
  ) => {
    const res = await deleteChecklistItem(templateId, checklistItemId);
    if (res.success) {
      triggerFetchTemplateDetail();
      reset();
    }
  };

  const onSaveHandler: SubmitHandler<inputs> = async (result: inputs) => {
    const body = {
      title: result.title,
      description: result.description,
      type: result.type,
    };
    const res = await updateChecklistItem(
      templateDetail?.id as string,
      checklistDetailData?.id as string,
      body
    );

    if (res.success) {
      triggerFetchTemplateDetail();
      reset();
    }
    dialogDetailChecklist.current?.close();
  };

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold">{templateDetail?.name}</h2>
        <button
          onClick={() => {
            dialogEditProject.current?.showModal();
          }}
          className="group flex relative py-2 px-3 gap-2 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
        >
          <Edit color="#3b82f6" size={22} />
          <p className="group-hover:text-blue-500">Edit</p>
        </button>
      </div>
      <p>{templateDetail?.description}</p>
      <button
        onClick={() => {
          dialogTagRef.current?.showModal();
        }}
        className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
      >
        <span className="text-blue-500 text-lg font-bold">+</span> Add checklist
        tag
      </button>
      <DragDropContext onDragEnd={dragEndHandler}>
        {templateDetail?.checklist_tag.map((item) => (
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
                <Trash className="text-red-500 duration-300 hover:text-red-400" />
              </button>
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
                                templateId={templateDetail.id}
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
                      <span className="text-blue-500 text-lg font-bold">+</span>{' '}
                      Add checklist item
                    </button>
                  </div>
                );
              }}
            </Droppable>
          </div>
        ))}
      </DragDropContext>

      <Modal dialogRef={dialogEditProject}>
        <form
          onSubmit={handleSubmit(onEditProjectSubmit)}
          className="flex flex-col gap-3 text-black"
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Edit Template
          </h1>
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
              {...register('template_description')}
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

      <Modal dialogRef={dialogDetailChecklist} maxW="custom">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(onSaveHandler)}
        >
          <h1 className="font-bold text-2xl text-center mb-1">
            Edit Checklist
          </h1>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <label htmlFor="title">Title</label>
              <input type="text" {...register('title')} />
            </div>
            <div className="flex items-end">
              <select
                id="type"
                className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-xl border-[#d7d7d7] hover:cursor-pointer"
                {...register('type')}
              >
                <option className="w-[40%]" value="none">
                  None
                </option>
                <option className="" value="narrative">
                  Attack Narrative
                </option>
                <option className="w-[40%]" value="vulnerability">
                  Vulnerability
                </option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea {...register('description')} />
          </div>
          <button
            onClick={() => {
              dialogChecklistRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Save
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
                onDeleteTag(templateDetail?.id as string, checklistTagId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

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
    </>
  );
};

export default TemplateDetail;
