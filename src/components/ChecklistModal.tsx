import { ChangeEvent, useState } from 'react';
import CvssCalculator from './CvssCalculator';

const ChecklistModal = ({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
}) => {
  const [checkListType, setCheckListType] = useState<
    'none' | 'attack narrative' | 'vulnerability'
  >('none');
  const [cvssValue, setCvssValue] = useState({
    AV: 'N',
    S: 'U',
    AC: 'L',
    C: 'N',
    PR: 'N',
    I: 'N',
    UI: 'N',
    A: 'N',
  });
  const [affectedTarget, setAffectedTarget] = useState([0]);
  const [references, setReferences] = useState([0]);
  const [capec, setCapec] = useState([0]);

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
  };

  const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as
      | 'none'
      | 'attack narrative'
      | 'vulnerability';
    setCheckListType(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-bold  text-2xl text-center mb-1">Add Check List</h1>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input type="text" />
        </div>
        <div className="flex items-end">
          <div className="">
            <select
              name="type"
              id="type"
              className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-md border-[#d7d7d7]"
              onChange={(e) => {
                selectHandler(e);
              }}
            >
              <option className="w-[40%]" value="none">
                None
              </option>
              <option className="" value="attack narrative">
                Attack Narrative
              </option>
              <option className="w-[40%]" value="vulnerability">
                Vulnerability
              </option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-4 ">
        <label htmlFor="">Complete</label>
        <input
          type="checkbox"
          className="w-6 border border-[#d7d7d7] text-blue-500 bg-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Description</label>
        <textarea />
      </div>
      {checkListType === 'vulnerability' ? (
        <>
          <div className="grid grid-cols-6 gap-6">
            <label htmlFor="" className="col-span-2">
              Vulnerability Name
            </label>
            <input type="text" className="col-span-4" />
            <label htmlFor="" className="col-span-2">
              Vulnerability Description
            </label>
            <textarea name="" id="" className="col-span-4 " />
          </div>

          <CvssCalculator cvssValue={cvssValue} setCvssValue={setCvssValue} />

          <div className="grid grid-cols-6 gap-6">
            <label htmlFor="" className="col-span-2">
              Status
            </label>
            <select className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-md border-[#d7d7d7] col-span-4">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Affected Target */}
            <label htmlFor="" className="col-span-2">
              Affected Target
            </label>
            <div className="flex flex-col gap-2 col-span-4">
              {affectedTarget.map((index: number) => {
                return (
                  <div key={`affectedTarget-${index}`} className="flex  gap-8">
                    <input type="text" className="" />
                    <button
                      type="button"
                      className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                      onClick={() => {
                        setAffectedTarget((prev) => {
                          let arr = [...prev];
                          arr = prev.filter((id: number) => id !== index);
                          return [...arr];
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setAffectedTarget((prev) => {
                    if (prev.length !== 0) {
                      return [...prev, prev[prev.length - 1] + 1];
                    }
                    return [0];
                  });
                }}
                className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
              >
                <span className="text-blue-500 text-sm font-bold">+</span> Add
                Item
              </button>
            </div>

            {/* References */}
            <label htmlFor="" className="col-span-2">
              References
            </label>
            <div className="flex flex-col gap-2 col-span-4">
              {references.map((index: number) => {
                return (
                  <div key={`references-${index}`} className="flex  gap-8">
                    <input type="text" className="" />
                    <button
                      type="button"
                      className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                      onClick={() => {
                        setReferences((prev) => {
                          let arr = [...prev];
                          arr = prev.filter((id: number) => id !== index);
                          return [...arr];
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setReferences((prev) => {
                    if (prev.length !== 0) {
                      return [...prev, prev[prev.length - 1] + 1];
                    }
                    return [0];
                  });
                }}
                className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
              >
                <span className="text-blue-500 text-sm font-bold">+</span> Add
                Item
              </button>
            </div>

            {/* CAPEC */}
            <label htmlFor="" className="col-span-2">
              CAPEC / CWE-ID / OWASP
            </label>
            <div className="flex flex-col gap-2 col-span-4">
              {capec.map((index: number) => {
                return (
                  <div key={`capec-${index}`} className="flex  gap-8">
                    <input type="text" className="" />
                    <button
                      type="button"
                      className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                      onClick={() => {
                        setCapec((prev) => {
                          let arr = [...prev];
                          arr = prev.filter((id: number) => id !== index);
                          return [...arr];
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setCapec((prev) => {
                    if (prev.length !== 0) {
                      return [...prev, prev[prev.length - 1] + 1];
                    }
                    return [0];
                  });
                }}
                className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
              >
                <span className="text-blue-500 text-sm font-bold">+</span> Add
                Item
              </button>
            </div>

            <label htmlFor="impact" className="col-span-2">
              Impact
            </label>
            <textarea name="impact" id="" className="col-span-4" />

            <label htmlFor="impact" className="col-span-2">
              Recommendation
            </label>
            <textarea name="impact" id="" className="col-span-4" />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Best Practice</label>
          <textarea />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Proof Of Concept</label>
        <textarea />
      </div>

      <div className="">
        <label htmlFor="" className="">
          Screenshot
        </label>
        <label className="mt-2 flex justify-center w-full h-32 px-4 transition bg-white border-2 border-blue-500 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="font-medium text-gray-600">
              Drop files to Attach, or{' '}
              <span className="text-blue-600 underline">browse</span>
            </span>
          </span>
          <input
            type="file"
            name="file_upload"
            className="hidden"
            onChange={fileHandler}
          />
        </label>
      </div>
      <button
        onClick={() => {
          dialogRef.current?.close();
        }}
        className="border border-[#d7d7d7] bg-blue-500 font-bold rounded-lg text-white py-2"
      >
        Save
      </button>
    </div>
  );
};

export default ChecklistModal;
