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
  moveTag,
  toggleChecklist,
  updateChecklistItem,
  updateChecklistTag,
  updateTemplate,
} from '../utils/api';
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
import { Edit, Pencil, Trash, ArrowDownUp } from 'lucide-react';
import ChecklistItem from '../components/ChecklistItem';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Modal from '../components/Modal';
import ModalAddTag from '../components/Modals/ModalAddTag';
import ModalAddChecklistItem from '../components/Modals/ModalAddChecklistItem';

type inputs = {
  update_tag_name: string;
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
  best_practice: string;
};

const TemplateDetail = () => {
  const { id } = useParams();
  const [templateDetail, setTemplateDetail, triggerFetchTemplateDetail] =
    useItemDetail<templateDetailType>(async () => {
      return await fetchTemplateDetail(id as string);
    });
  const [checklistTagId, setChecklistTagId] = useState('');
  const { register, reset, resetField, handleSubmit, setValue } =
    useForm<inputs>();

  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDeleteChecklist = useRef<HTMLDialogElement>(null);
  const dialogDetailChecklist = useRef<HTMLDialogElement>(null);
  const [checklistDetailData, setChecklistDetailData] =
    useState<ChecklistDetailT | null>(null);
  const dialogEditTemplate = useRef<HTMLDialogElement>(null);
  const dialogEditTag = useRef<HTMLDialogElement>(null);
  const dialogMoveTag = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (checklistDetailData) {
      setValue('title', checklistDetailData.title);
      setValue('description', checklistDetailData.description);
      setValue('type', checklistDetailData.type ?? 'None');
      setValue('best_practice', checklistDetailData.best_practice);
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

  const onSubmitEditTag = async (res: inputs) => {
    const data = await updateChecklistTag(
      templateDetail?.id as string,
      checklistTagId,
      {
        name: res.update_tag_name,
      }
    );

    if (data.success) {
      triggerFetchTemplateDetail();
    }
  };

  const onTagModalSubmit = async (tag_name: string) => {
    const result = await addChecklistTag(
      templateDetail?.id as string,
      tag_name
    );

    if (result.success) {
      resetField('tag_name');
      triggerFetchTemplateDetail();
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
  const onChecklistTagModalSubmit = async (checklist_name: string) => {
    resetField('checklist_name');
    const res = await addChecklistTagItem(
      templateDetail?.id as string,
      checklistTagId,
      checklist_name
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
      best_practice: result.best_practice,
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
  async function dragEndTagHandler(result: DropResult) {
    const { destination, source } = result;
    const temp = Array.from(templateDetail?.checklist_tag as ChecklistTag[]);

    const [reorderedItem] = temp.splice(source.index, 1);

    temp.splice(destination?.index as number, 0, reorderedItem);

    temp.forEach((item: ChecklistTag, index: number) => {
      item.priority = index;
    });

    setTemplateDetail(
      (prev) =>
        ({
          ...prev,
          checklist_tag: temp,
        } as templateDetailType)
    );

    const body = {
      checklist_tag: temp,
    };

    moveTag({
      templateId: templateDetail?.id as string,
      body: body,
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between ">
        <h2 className="text-4xl font-bold">{templateDetail?.name}</h2>
        <button
          onClick={() => {
            dialogEditTemplate.current?.showModal();
          }}
          className="group flex relative py-2 px-3 gap-2 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
        >
          <Edit color="#3b82f6" size={22} />
          <p className="group-hover:text-blue-500">Edit</p>
        </button>
      </div>
      <p>{templateDetail?.description}</p>
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
        {templateDetail?.checklist_tag.map((item) => (
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
                                templateId={templateDetail.id}
                                title={checklistItem.title}
                                progress={checklistItem.progress}
                                onToggleProgress={onToggleProgress}
                                onDeleteCheckListItem={onDeleteCheckListItem}
                                isTemplate={true}
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
                    {templateDetail?.checklist_tag.map(
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

      <Modal dialogRef={dialogEditTemplate}>
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

          <button
            onClick={() => {
              dialogEditTemplate.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 mb-1 bg-blue-500 font-bold  text-white py-2"
          >
            Create Project
          </button>
        </form>
      </Modal>

      {/* Modal Add Tag */}
      <ModalAddTag
        dialogTagRef={dialogTagRef}
        onTagModalSubmit={onTagModalSubmit}
      />

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
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea {...register('description')} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="best_practice">Best Practice</label>
            <textarea id="best_practice" {...register('best_practice')} />
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
              className="w-full py-2 bg-gray-500 hover:bg-gray-400 duration-300 text-white rounded-md"
              onClick={() => {
                dialogDeleteTag.current?.close();
              }}
            >
              Cancel
            </button>
            <button
              className="w-full py-2 bg-red-500 hover:bg-red-400 duration-300 rounded-md text-white"
              onClick={() => {
                onDeleteTag(templateDetail?.id as string, checklistTagId);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <ModalAddChecklistItem
        dialogChecklistRef={dialogChecklistRef}
        onChecklistTagModalSubmit={onChecklistTagModalSubmit}
      />
    </div>
  );
};

export default TemplateDetail;
