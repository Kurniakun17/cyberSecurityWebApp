import { useRef, useState } from 'react';
import ChecklistItem from '../components/ChecklistItem';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';
import useProjectDetail from '../hooks/useProjectDetail';
import Modal from '../components/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
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
  moveChecklist,
  moveChecklistToAnotherTag,
  toggleChecklist,
} from '../utils/helper';
import { FileText, Trash } from 'lucide-react';
import ChecklistModal from '../components/ChecklistModal';
import { Jelly } from '@uiball/loaders';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type inputs = {
  tag_name: string;
  checklist_name: string;
  client_name: string;
  report_type: string;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, setProjectDetail, triggerFetchProjectDetail] =
    useProjectDetail<projectDetailType>(id as string);
  const { register, handleSubmit, reset, resetField } = useForm<inputs>();
  const [checklistTagId, setChecklistTagId] = useState('');
  const [loading, setLoading] = useState(false);

  const dialogTagRef = useRef<HTMLDialogElement>(null);
  const dialogChecklistRef = useRef<HTMLDialogElement>(null);
  const dialogDeleteTag = useRef<HTMLDialogElement>(null);
  const dialogDeleteChecklist = useRef<HTMLDialogElement>(null);
  const dialogDetailChecklist = useRef<HTMLDialogElement>(null);
  const dialogExportToDocx = useRef<HTMLDialogElement>(null);

  const [checklistDetailData, setChecklistDetailData] =
    useState<ChecklistDetailT | null>(null);

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
      const res = await exportToDocx(projectDetail?.id as string, {
        client: data.client_name,
        report_type: data.report_type,
      });
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onChecklistModalSubmit: SubmitHandler<inputs> = async (data) => {
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

  function dragEndHandler(result) {
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
      setProjectDetail((prev) => ({
        ...prev,
        template: { ...prev.template, checklist_tag: temp },
      }));

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
    setProjectDetail((prev) => ({
      ...prev,
      template: { ...prev.template, checklist_tag: temp },
    }));

    moveChecklistToAnotherTag({
      templateId: projectDetail?.template_id,
      body: {
        target_tag_id: temp[destTagIndex].id,
        checklist_id: reorderedItem.id,
      },
    });
  }

  if (!projectDetail) {
    return <div>Loading</div>;
  }

  return (
    <>
      <div className={`flex ${loading && 'overflow-hidden'}`}>
        {loading && (
          <div className="fixed z-[9999] flex flex-col gap-24 justify-center items-center h-screen w-screen bg-[rgba(255,255,255,0.9)] ">
            <Jelly size={100} color="#3b82f6" />
            <h1 className="text-2xl text-blue-500 font-bold">
              Exporting projects to docx...
            </h1>
          </div>
        )}
        <Sidebar />
        <div className="pt-8 grow lg:ml-[300px] my-[72px]">
          <div className="w-[85%]  mx-auto flex flex-col gap-6 ">
            <div className="flex justify-between">
              <h2 className="text-4xl font-bold">{projectDetail.name}</h2>
              <button
                onClick={() => {
                  dialogExportToDocx.current?.showModal();
                }}
                className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
              >
                <div className="flex gap-2">
                  Export to docx
                  <FileText color="#3b82f6" />
                </div>
              </button>
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
              className="py-2 px-3 gap-4 rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
            >
              <span className="text-blue-500 text-lg font-bold">+</span> Add
              checklist tag
            </button>

            <DragDropContext onDragEnd={dragEndHandler}>
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
                            (
                              checklistItem: ChecklistItemType,
                              index: number
                            ) => (
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
                                      triggerFetchProjectDetail={
                                        triggerFetchProjectDetail
                                      }
                                      dialogDeleteChecklist={
                                        dialogDeleteChecklist
                                      }
                                      templateId={projectDetail.template.id}
                                      title={checklistItem.title}
                                      progress={checklistItem.progress}
                                      onToggleProgress={onToggleProgress}
                                      onDeleteCheckListItem={
                                        onDeleteCheckListItem
                                      }
                                      onModalOpen={asyncFetchChecklistDetail}
                                    />
                                  );
                                }}
                              </Draggable>
                            )
                          )}
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
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>

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

      {/* Modal Add Checklist */}
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

      {/* Modal Delete Checklist */}
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
