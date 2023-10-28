import { useEffect, useRef, useState } from 'react';
import { getReference, mainUrl } from '../utils/api';
import { Reference } from '../utils/types';

import { useForm } from 'react-hook-form';
import Modal from '../components/Modal';
import { colorRatings, severityRatings } from '../utils/cvss';
import { generateVectorString } from '../components/CvssCalculator';
import ReactPaginate from 'react-paginate';

type inputs = {
  vulnerability: string;
  title: string;
};

const References = () => {
  const [reference, setReference] = useState<Reference>();
  const [referenceIndex, setReferenceIndex] = useState<number>(0);

  const dialogChecklistDetail = useRef<HTMLDialogElement>(null);
  const limit = 8;
  const { register, watch } = useForm<inputs>();

  useEffect(() => {}, [watch('vulnerability'), watch('title')]);

  useEffect(() => {
    fetchReference(0, limit, '', '');
  }, []);

  const fetchReference = async (
    pageCount: number,
    sizeCount: number,
    vulnerability_name: string,
    title: string
  ) => {
    const res = await getReference(
      pageCount,
      sizeCount,
      vulnerability_name,
      title
    );
    if (res.success) {
      setReference(res.data);
    }
  };

  const getSeverityLevel = () => {
    if (reference)
      return severityRatings.filter(
        (item) =>
          reference.items![referenceIndex].cvss_score >= item.bottom &&
          reference.items![referenceIndex].cvss_score <= item.top
      )[0].name;
  };

  const getBaseScoreColor = () => {
    return colorRatings[
      getSeverityLevel() as '' | 'None' | 'Low' | 'High' | 'Critical'
    ];
  };

  const checklistType = {
    narrative: 'Attack Narrative',
    vulnerability: 'Vulnerability',
  };

  const searchReference = () => {
    fetchReference(0, limit, watch('title'), watch('vulnerability'));
  };

  const onPageHandleClick = (data: { selected: number }) => {
    fetchReference(
      data.selected,
      limit,
      watch('title'),
      watch('vulnerability')
    );
  };

  return (
    <>
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">Checklist Reference</h2>
      </div>
      <div className="flex flex-col gap-2">
        <input type="text" {...register('title')} placeholder="Title" />
        <input
          type="text"
          {...register('vulnerability')}
          placeholder="Vulnerability Name"
        />
        <button
          onClick={searchReference}
          className="w-fit px-4 py-1 bg-blue-500 text-white font-semibold rounded-lg text-lg"
        >
          Search
        </button>
      </div>
      <div className=" border border-slate-300"></div>
      <div className="flex flex-col gap-4">
        {reference?.items?.map((item, index: number) => (
          <button
            key={item.id}
            onClick={() => {
              setReferenceIndex(index);
              dialogChecklistDetail.current?.showModal();
            }}
            className="p-4 px-8 flex items-center justify-between border border-[#D7D7D7] hover:border-blue-500 duration-300 rounded-2xl cursor-pointer"
          >
            <h2>{item.title}</h2>
            <p>{item.vulnerability_name}</p>
          </button>
        ))}
      </div>

      <ReactPaginate
        previousLabel="<"
        nextLabel=">"
        pageCount={reference?.totalPages as number}
        breakLabel="..."
        onPageChange={onPageHandleClick}
        containerClassName="flex gap-3 w-fit mx-auto"
        pageClassName=" rounded-md border font-bold"
        nextClassName=" border rounded-md font-bold"
        previousClassName=" border rounded-md font-bold "
        activeClassName="border text-blue-500 border-blue-500"
      ></ReactPaginate>

      <Modal maxW="custom" dialogRef={dialogChecklistDetail}>
        {reference?.items![referenceIndex] != null && (
          <form className="flex flex-col gap-6">
            <h1 className="font-bold text-2xl text-center mb-1">
              Checklist Detail
            </h1>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <label htmlFor="title">Title</label>

                <input
                  style={{ width: '500px' }}
                  type="text"
                  value={reference?.items![referenceIndex].title}
                  disabled
                />
              </div>
              <div className="flex items-end">
                <div className="">
                  <input
                    disabled
                    id="type"
                    className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-xl border-[#d7d7d7] "
                    value={
                      checklistType[
                        reference?.items![referenceIndex].type as
                          | 'narrative'
                          | 'vulnerability'
                      ]
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="description">Description</label>
              <textarea className="resize-y border rounded-md p-2 w-full min-h-[5rem]" 
                disabled
                value={reference?.items![referenceIndex].description}
              />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="description">Best Practice</label>
                <textarea
                  className="resize-y border rounded-md p-2 w-full min-h-[5rem]"
                  disabled
                  value={reference.items![referenceIndex].best_practice}
                />
              </div>
            {reference?.items![referenceIndex].type === 'vulnerability' ? (
              <>
                <div className="grid grid-cols-6 gap-6">
                  <label htmlFor="" className="col-span-2">
                    Vulnerability Name
                  </label>
                  <input
                    type="text"
                    className="col-span-4"
                    disabled
                    value={reference?.items![referenceIndex].vulnerability_name}
                  />
                  <label htmlFor="" className="col-span-2">
                    Vulnerability Description
                  </label>
                  <textarea
                    id=""
                    className="resize-y border rounded-md p-2 w-full min-h-[5rem] col-span-4"
                    disabled
                    value={
                      reference?.items![referenceIndex]
                        .vulnerability_description
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
                        {reference?.items![referenceIndex].cvss_score}
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
                            reference?.items![referenceIndex].attack_vector ===
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
                            reference?.items![referenceIndex].attack_vector ===
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
                            reference?.items![referenceIndex].attack_vector ===
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
                            reference?.items![referenceIndex].attack_vector ===
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
                            reference?.items![referenceIndex].scope ===
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
                            reference?.items![referenceIndex].scope ===
                            'Changed'
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex].confidentiality ===
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
                            reference.items![referenceIndex].confidentiality ===
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
                            reference.items![referenceIndex].confidentiality ===
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex].integrity ===
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
                            reference.items![referenceIndex].integrity === 'Low'
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
                            reference.items![referenceIndex].integrity ===
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex]
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
                            reference.items![referenceIndex].availability ===
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
                            reference.items![referenceIndex].availability ===
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
                            reference.items![referenceIndex].availability ===
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
                      <span className="font-bold text-sm">
                        {generateVectorString({
                          attack_vector:
                            reference.items![referenceIndex].attack_vector,
                          attack_complexity:
                            reference.items![referenceIndex].attack_complexity,
                          privilege_required:
                            reference.items![referenceIndex].privilege_required,
                          user_interaction:
                            reference.items![referenceIndex].user_interaction,
                          scope: reference.items![referenceIndex].scope,
                          confidentiality:
                            reference.items![referenceIndex].confidentiality,
                          integrity: reference.items![referenceIndex].integrity,
                          availability:
                            reference.items![referenceIndex].availability,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 w-full">
                  <label htmlFor="" className="col-span-2">
                    Status
                  </label>
                  <input
                    disabled
                    value={reference.items![referenceIndex].status}
                    className="px-2 py-1 pr-16 focus:outline-blue-500 border background rounded-md border-[#d7d7d7] col-span-4"
                  />

                  {/* Affected Target */}
                  <label htmlFor="" className="col-span-2">
                    Affected Target
                  </label>
                  <div className="flex flex-col gap-2 col-span-4">
                    {reference
                      .items![referenceIndex].affected_target.split(',')
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
                    value={reference.items[referenceIndex].category}
                    className="col-span-4"
                  />
                  {/* References */}
                  <label htmlFor="" className="col-span-2">
                    References
                  </label>
                  <div className="flex flex-col gap-2 col-span-4">
                    {reference.items[referenceIndex].reference
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
                    {reference.items[referenceIndex].capec_owasp_cwe
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
                    value={reference.items[referenceIndex].impact}
                    id=""
                    className="resize-y border rounded-md p-2 w-full min-h-[5rem] col-span-4"
                  />

                  <label htmlFor="impact" className="col-span-2 break-words">
                    Recommendation
                  </label>
                  <textarea
                    disabled
                    value={reference.items[referenceIndex].recommendation}
                    id=""
                    className="resize-y border rounded-md p-2 w-full min-h-[5rem] col-span-4"
                  />
                </div>
              </>
            ) : (
             <></>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="description">Proof Of Concept</label>
              <textarea className="resize-y border rounded-md p-2 w-full min-h-[5rem]" disabled value={reference.items![referenceIndex].poc} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="">
                Screenshot
              </label>
              {reference.items![referenceIndex].images.length > 0 ? (
                <div
                  key={'screenshot container'}
                  className="flex gap-4 flex-wrap"
                >
                  {reference.items![referenceIndex].images.map(
                    (item: {
                      file_path: string;
                      file_caption: string;
                      id: string;
                    }) => {
                      if (
                        item.file_path.includes(
                          'C:\\Mengoding\\Back-End\\pentest-report'
                        )
                      ) {
                        item.file_path = item.file_path.replace(
                          'C:\\Mengoding\\Back-End\\pentest-report',
                          ''
                        );
                      }

                      return (
                        <div
                          key={item.file_path}
                          className="flex flex-col items-center justify-center relative"
                        >
                          <img
                            src={`${mainUrl}${item.file_path}`}
                            alt=""
                            className="aspect-video h-16 object-cover rounded-sm"
                          />
                          <p>{item.file_caption}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : null}
            </div>

            <button
              onClick={() => {
                dialogChecklistDetail.current?.close();
              }}
              type="button"
              className="border border-[#d7d7d7] bg-blue-500 font-bold rounded-lg text-white py-2"
            >
              Close
            </button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default References;
