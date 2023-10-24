import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { deleteRiskMap, getRiskMapList } from '../utils/api';
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
  add_tag: string[];
};

const RiskMapping = () => {
  const [riskList, setRiskList] = useState<RiskList[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemId, setItemId] = useState<string>('');
  const [itemIndex, setItemIndex] = useState<number>(-1);
  const dialogDeleteRef = useRef<HTMLDialogElement>(null);
  const dialogEditRef = useRef<HTMLDialogElement>(null);
  const limit = 8;

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<inputs>();

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
          <h2 className="font-bold text-2xl">Risk Mapping</h2>
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
              // target="_blank"
              className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
            >
              <h2 className="text-start pr-8">{item.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemId(item.id);
                    setItemIndex(index);
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

      <Modal dialogRef={dialogEditRef}>
        <form action="">
          <div className="flex flex-col gap-2 col-span-4">
            {add_tag.map((field, index) => {
              return (
                <div key={`add_tag-${field.id}`} className="flex  gap-8">
                  <input
                    key={field.id}
                    type="text"
                    {...register(`add_tag.${index}` as const)}
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
        </form>
      </Modal>
    </>
  );
};

export default RiskMapping;
