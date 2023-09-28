import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getReference } from '../utils/helper';
import { ChecklistDetailT, Reference, UserData } from '../utils/types';
import { Jelly } from '@uiball/loaders';
import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import { colorRatings, severityRatings } from '../utils/cvss';

type inputs = {
  vulnerability: string;
  title: string;
};

const References = ({ userData }: { userData: UserData }) => {
  const [reference, setReference] = useState<Reference>();
  const [referenceIndex, setReferenceIndex] = useState<number>(0);
  const [filteredReference, setFilteredReference] =
    useState<ChecklistDetailT[]>();
  const dialogChecklistDetail = useRef<HTMLDialogElement>(null);

  const { register, watch } = useForm<inputs>();

  useEffect(() => {
    filterItem();
  }, [watch('vulnerability'), watch('title')]);

  useEffect(() => {
    fetchReference();
  }, []);

  const filterItem = () => {
    const vulnerability = watch('vulnerability');
    const title = watch('title');

    if (!vulnerability && !title) {
      setFilteredReference(reference?.items);
      return;
    }
    const newItems = reference?.items.filter(
      (item) =>
        item.title.toLowerCase().includes(title.toLowerCase()) &&
        item.vulnerability_name
          .toLowerCase()
          .includes(vulnerability.toLowerCase())
    );
    console.log(newItems);

    setFilteredReference(newItems);
  };

  const fetchReference = async () => {
    const res = await getReference();
    if (res.success) {
      setReference(res.data);
      setFilteredReference(res.data.items);
    }
  };

  if (!filteredReference) {
    return (
      <div className="flex">
        <Sidebar active="reference" />
        <div className="my-[72px] lg:ml-[300px] grow">
          <div className="mx-auto my-[100px] w-fit flex flex-col text-center">
            <Jelly size={72} color="#3b82f6" />
            <p className="my-8 font-bold text-xl text-blue-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityLevel = () => {
    return severityRatings.filter(
      (item) =>
        filteredReference![referenceIndex].cvss_score >= item.bottom &&
        filteredReference![referenceIndex].cvss_score <= item.top
    )[0].name as '' | 'None' | 'Low' | 'High' | 'Critical';
  };

  const getBaseScoreColor = () => {
    return colorRatings[getSeverityLevel()];
  };

  console.log(filteredReference);

  return (
    <>
      <div className="flex">
        <Sidebar active="reference" userData={userData} />
        <div className="lg:ml-[300px] my-[72px] py-8 grow">
          <div className="w-[85%] mx-auto  flex flex-col gap-6 overflow-visible">
            <div className="flex justify-between">
              <h2 className="font-bold text-2xl">Reference</h2>
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                {...register('vulnerability')}
                placeholder="Vulnerability Name"
              />
              <input type="text" {...register('title')} placeholder="Title" />
            </div>
            <div className=" border border-slate-300"></div>
            <div className="flex flex-col gap-4">
              {filteredReference?.map((item, index: number) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setReferenceIndex(index);
                    dialogChecklistDetail.current?.showModal();
                  }}
                  className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
                >
                  <h2>{item.title}</h2>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal dialogRef={dialogChecklistDetail}>
        <form className="flex flex-col gap-6">
          <h1 className="font-bold text-2xl text-center mb-1">
            Add Check List
          </h1>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <label htmlFor="title">Title</label>

              <input
                type="text"
                value={filteredReference![referenceIndex].title}
                disabled
              />
            </div>
            <div className="flex items-end">
              <div className="">
                <select
                  disabled
                  id="type"
                  className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-xl border-[#d7d7d7] hover:cursor-pointer"
                  value={filteredReference![referenceIndex].type}
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
          </div>
          <div className="flex gap-4 ">
            <label htmlFor="">Complete</label>
            <input
              disabled
              value={filteredReference![referenceIndex].progress}
              type="checkbox"
              className="w-6 border border-[#d7d7d7] text-blue-500 bg-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              disabled
              value={filteredReference![referenceIndex].description}
            />
          </div>
          {filteredReference![referenceIndex].type === 'vulnerability' ? (
            <>
              <div className="grid grid-cols-6 gap-6">
                <label htmlFor="" className="col-span-2">
                  Vulnerability Name
                </label>
                <input
                  type="text"
                  className="col-span-4"
                  disabled
                  value={filteredReference![referenceIndex].vulnerability_name}
                />
                <label htmlFor="" className="col-span-2">
                  Vulnerability Description
                </label>
                <textarea
                  id=""
                  className="col-span-4 "
                  disabled
                  value={
                    filteredReference![referenceIndex].vulnerability_description
                  }
                />
              </div>

              <div className="border border-[#d7d7d7] p-4 rounded-xl flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-xl">CVSS Calculator</p>
                  <div
                    className={`${getBaseScoreColor()} flex flex-col items-center pb-1 px-6 rounded-xl min-w-[108px]`}
                  >
                    <h4 className="font-bold text-white text-xl">
                      {filteredReference![referenceIndex].cvss_score}
                    </h4>
                    <p className="text-white text-sm">
                      (
                      {getSeverityLevel() === ''
                        ? 'Please fill all of the available options'
                        : getSeverityLevel()}
                      )
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      Attack Vector (AV)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].attack_vector ===
                          'Network'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Network (N)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].attack_vector ===
                          'Adjacent'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Adjecent (A)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].attack_vector ===
                          'Local'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Local (L)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].attack_vector ===
                          'Physical'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Physical (P)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">Scope (S)</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].scope ===
                          'Unchanged'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Unchanged (U)</p>
                      </button>
                      <button
                        type="button"
                        className={`${
                          filteredReference![referenceIndex].scope === 'Changed'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Changed (C)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      Attack Complexity (AC)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex]
                            .attack_complexity === 'Low'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Low (L)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex]
                            .attack_complexity === 'High'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>High (H)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      Confidentiality (C)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].confidentiality ===
                          'None'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>None (N)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].confidentiality ===
                          'Low'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Low (L)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].confidentiality ===
                          'High'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>High (H)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      Previliges Required (PR)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex]
                            .privilege_required === 'None'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>None (N)</p>
                      </button>
                      <button
                        type="button"
                        className={`${
                          filteredReference![referenceIndex]
                            .privilege_required === 'Low'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Low (L)</p>
                      </button>
                      <button
                        type="button"
                        className={`${
                          filteredReference![referenceIndex]
                            .privilege_required === 'High'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>High (H)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">Integrity (I)</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].integrity ===
                          'None'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>None (N)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].integrity === 'Low'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Low (L)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].integrity ===
                          'High'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>High (H)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      User Interaction(UI)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={`${
                          filteredReference![referenceIndex]
                            .user_interaction === 'None'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>None (N)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex]
                            .user_interaction === 'Required'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Required (R)</p>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-bold text-blue-500">
                      Availability (A)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].availability ===
                          'None'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>None (N)</p>
                      </button>
                      <button
                        type="button"
                        disabled
                        className={`${
                          filteredReference![referenceIndex].availability ===
                          'Low'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>Low (L)</p>
                      </button>
                      <button
                        type="button"
                        className={`${
                          filteredReference![referenceIndex].availability ===
                          'High'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-[#d7d7d7] text-black'
                        } border p-1 px-2 rounded-md`}
                      >
                        <p>High (H)</p>
                      </button>
                    </div>
                  </div>
                  <div className="my-2 col-span-2 flex items-center bg-blue-500 p-2 px-4 gap-2 text-white rounded-lg">
                    <h4 className="text-lg">Vector String - </h4>
                    <span className="font-bold text-sm">asdasdasd</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-6 w-full">
                <label htmlFor="" className="col-span-2">
                  Status
                </label>
                <select
                  disabled
                  value={filteredReference![referenceIndex].status}
                  className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-md border-[#d7d7d7] col-span-4"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>

                {/* Affected Target */}
                <label htmlFor="" className="col-span-2">
                  Affected Target
                </label>
                <div className="flex flex-col gap-2 col-span-4">
                  {filteredReference![referenceIndex].affected_target
                    .split(',')
                    .map((item) => {
                      return (
                        <div
                          key={`affectedTarget-${item}`}
                          className="flex  gap-8"
                        >
                          <input
                            type="text"
                            disabled
                            value={item}
                            className=""
                          />
                        </div>
                      );
                    })}
                </div>

                <label htmlFor="category" className="col-span-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  disabled
                  value={filteredReference[referenceIndex].category}
                  className="col-span-4"
                />
                {/* References */}
                <label htmlFor="" className="col-span-2">
                  References
                </label>
                <div className="flex flex-col gap-2 col-span-4">
                  {filteredReference[referenceIndex].reference
                    .split(',')
                    .map((item) => {
                      return (
                        <div className="flex gap-8" key={`reference-${item}`}>
                          <input
                            type="text"
                            value={item}
                            disabled
                            className=""
                          />
                        </div>
                      );
                    })}
                </div>

                {/* CAPEC */}
                <label htmlFor="" className="col-span-2">
                  CAPEC / CWE-ID /OWASP
                </label>
                <div className="flex flex-col gap-2 col-span-4">
                  {filteredReference[referenceIndex].capec_owasp_cwe
                    .split(',')
                    .map((item) => {
                      return (
                        <div
                          key={`capec_owasp_cwe-${item}`}
                          className="flex  gap-8"
                        >
                          <input
                            type="text"
                            className=""
                            disabled
                            value={item}
                          />
                        </div>
                      );
                    })}
                </div>

                <label htmlFor="impact" className="col-span-2">
                  Impact
                </label>
                <textarea
                  disabled
                  value={filteredReference[referenceIndex].impact}
                  id=""
                  className="col-span-4"
                />

                <label htmlFor="impact" className="col-span-2 break-words">
                  Recommendation
                </label>
                <textarea
                  disabled
                  value={filteredReference[referenceIndex].recommendation}
                  id=""
                  className="col-span-4"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <label htmlFor="description">Best Practice</label>
              <textarea
                disabled
                value={filteredReference![referenceIndex].best_practice}
              />
            </div>
          )}
          <input
            onClick={() => {
              dialogChecklistDetail.current?.close();
            }}
            type="button"
            value="Close"
            className="border border-[#d7d7d7] bg-blue-500 font-bold rounded-lg text-white py-2"
          />
        </form>
      </Modal>
    </>
  );
};

export default References;
