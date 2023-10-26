import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { deleteRiskMap, getRiskMapList, updateRiskMap } from '../utils/api';
import Modal from '../components/Modal';

type RiskList = {
  id: string;
  title: string;
  url: string;
  tag: string;
};

type inputs = {
  tag: string;
  title: string;
};

type inputsEdit = {
  edit_tag: string[];
  edit_title: string;
  edit_url: string;
};

type inputsAdd = {
  add_tag: string[];
  add_title: string;
  add_url: string;
};

const RiskMapping = () => {
  const [riskList, setRiskList] = useState<RiskList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemId, setItemId] = useState<string>('');
  const [itemIndex, setItemIndex] = useState<number>(-1);

  const dialogDeleteRef = useRef<HTMLDialogElement>(null);
  const dialogEditRef = useRef<HTMLDialogElement>(null);
  const dialogAddRef = useRef<HTMLDialogElement>(null);

  const limit = 8;

  const { register, watch } = useForm<inputs>();

  const {
    register: registerEdit,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<inputsEdit>();

  const {
    fields: edit_tag,
    remove: removeEdit_tags,
    append: appendEdit_tags,
  } = useFieldArray({
    control,
    name: 'edit_tag',
  });

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    control: controlAdd,
    formState: { errors: errorsAdd },
  } = useForm<inputsAdd>();

  const {
    fields: add_tag,
    remove: removeAdd_tags,
    append: appendAdd_tags,
  } = useFieldArray({
    control,
    name: 'add_tag',
  });

  useEffect(() => {
    fetchRiskMap(0, limit, '', '');
  }, []);

  const onDeleteRiskMap = async (riskMapId: string, index: number) => {
    const res = await deleteRiskMap(riskMapId);
    if (res.success) {
      const temp = riskList;
      temp.splice(index, 1);
      setRiskList([...temp]);
    }
  };

  const onSaveEditHandler = async (res: inputsEdit) => {
    const response = await updateRiskMap(itemId, {
      title: res.edit_title,
      tag: res.edit_tag,
      url: res.edit_url ?? [''],
    });

    if (response.success) {
      dialogEditRef.current?.close();
      const temp = riskList;
      temp.splice(itemIndex, 1, response.data);
    }
  };

  const onAddReferenceHandler = async (res: inputsAdd) => {
    console.log(res);
  };

  const fetchRiskMap = async (
    pageCount: number,
    sizeCount: number,
    title: string,
    tag: string
  ) => {
    const res = await getRiskMapList(pageCount, sizeCount, title, tag);
    if (res.success) {
      setRiskList(res.data.items);
      setTotalPages(res.data.totalPages);
    }
  };

  const searchRiskMap = () => {
    fetchRiskMap(0, limit, watch('title'), watch('tag'));
  };

  const onPageHandleClick = (data: { selected: number }) => {
    fetchRiskMap(data.selected, limit, watch('title'), watch('tag'));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Risk Mapping Reference</h2>
          <button
            onClick={() => {
              dialogAddRef.current?.showModal();
            }}
            className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] hover:border-blue-500 duration-300 w-fit"
          >
            <span className="text-blue-500 text-sm font-bold">+</span> Add
            Reference
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <input type="text" {...register('title')} placeholder="Title Name" />
          <input type="text" {...register('tag')} placeholder="Tag Name" />
          <button
            onClick={searchRiskMap}
            className="w-fit px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg text-lg"
          >
            Search
          </button>
        </div>
        <div className=" border border-slate-300"></div>
        <div className="flex flex-col gap-4">
          {riskList?.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                window.open(item.url, '_blank');
              }}
              className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
            >
              <h2 className="text-start pr-8">{item.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemId(item.id);
                    setItemIndex(index);

                    setValue('edit_title', riskList[index].title);
                    setValue('edit_url', riskList[index].url);
                    setValue('edit_tag', riskList[index].tag.split(','));
                    dialogEditRef.current?.showModal();
                  }}
                  className="py-1 h-fit px-4 gap-3 rounded-lg hover:border-yellow-500 hover:text-yellow-500 duration-300 border border-[#D7D7D7]"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemId(item.id);
                    setItemIndex(index);
                    dialogDeleteRef.current?.showModal();
                  }}
                  className="py-1 px-4 h-fit gap-3 rounded-lg border hover:border-red-500 hover:text-red-500 duration-300 border-[#D7D7D7]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          pageCount={totalPages as number}
          breakLabel="..."
          onPageChange={onPageHandleClick}
          containerClassName="flex gap-3 w-fit mx-auto"
          pageClassName=" rounded-md border font-bold"
          nextClassName=" border rounded-md font-bold"
          previousClassName=" border rounded-md font-bold "
          activeClassName="border text-blue-500 border-blue-500"
        ></ReactPaginate>
      </div>

      <Modal dialogRef={dialogDeleteRef}>
        <div>
          <div className="flex flex-col gap-8">
            <h1 className="font-bold text-red-500 text-2xl text-center ">
              Delete Risk Map
            </h1>
            <p className="text-center">
              Are you sure you want to delete this risk map?
            </p>
            <div className="flex gap-6">
              <button
                className="w-full py-2 bg-gray-500 text-white rounded-md"
                onClick={() => {
                  dialogDeleteRef.current?.close();
                }}
              >
                Cancel
              </button>
              <button
                className="w-full py-2 bg-red-500 rounded-md text-white"
                onClick={() => {
                  onDeleteRiskMap(itemId, itemIndex);
                  dialogDeleteRef.current?.close();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal dialogRef={dialogAddRef}>
        <form
          className="flex flex-col gap-3 text-black"
          onSubmit={handleSubmitAdd(onAddReferenceHandler)}
        >
          <h1 className="font-bold text-2xl text-center mb-1">
            Add Risk Map Reference
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="checklistTag" className="text-grayText">
              Title
            </label>
            <input
              {...registerAdd('add_title', { required: true })}
              id="checklistTag"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errorsAdd.add_title?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          {/*  */}
          <div className="flex flex-col gap-1">
            <label htmlFor="checklistTag" className="text-grayText">
              Url
            </label>
            <input
              {...registerAdd('add_url', { required: true })}
              id="checklistTag"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errorsAdd.add_url?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="flex flex-col gap-2 col-span-4">
            <label htmlFor="target-ip" className="text-grayText">
              Target IP
            </label>
            {add_tag.map((field, index) => {
              return (
                <div key={`add_tag-${field.id}`} className="flex  gap-8">
                  <input
                    key={field.id}
                    type="text"
                    {...registerAdd(`add_tag.${index}` as const)}
                    className=""
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                    onClick={() => {
                      removeAdd_tags(index);
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
                appendAdd_tags('');
              }}
              className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
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

      <Modal dialogRef={dialogEditRef}>
        <form
          className="flex flex-col gap-3 text-black"
          onSubmit={handleSubmit(onSaveEditHandler)}
        >
          <h1 className="font-bold  text-2xl text-center mb-1">
            Edit Risk Map Reference
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="checklistTag" className="text-grayText">
              Title
            </label>
            <input
              {...registerEdit('edit_title', { required: true })}
              id="checklistTag"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errors.edit_title?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          {/*  */}
          <div className="flex flex-col gap-1">
            <label htmlFor="checklistTag" className="text-grayText">
              Url
            </label>
            <input
              {...registerEdit('edit_url', { required: true })}
              id="checklistTag"
              type="text"
              className="border border-[#d7d7d7] w-full rounded-md px-2 py-1 focus:outline-blue-500"
            />
            {errors.edit_url?.type === 'required' && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </div>
          <div className="flex flex-col gap-2 col-span-4">
            <label htmlFor="target-ip" className="text-grayText">
              Target IP
            </label>
            {edit_tag.map((field, index) => {
              return (
                <div key={`add_tag-${field.id}`} className="flex  gap-8">
                  <input
                    key={field.id}
                    type="text"
                    {...registerEdit(`edit_tag.${index}` as const)}
                    className=""
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                    onClick={() => {
                      removeEdit_tags(index);
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
                appendEdit_tags('');
              }}
              className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
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
    </>
  );
};

export default RiskMapping;
