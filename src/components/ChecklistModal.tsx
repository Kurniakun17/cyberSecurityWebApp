import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import CvssCalculator from './CvssCalculator';
import {
  ChecklistDetailT,
  checklistItemInputT,
  cvss31ValueT,
  Image,
} from '../utils/types';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  deletePOCImage,
  updateChecklistItem,
  uploadPocImage,
} from '../utils/api';
import Modal from './Modal';
import { X } from 'lucide-react';

type inputValuesT = {
  title: string;
  type: string;
  progress: number;
  description: string;
  generate_to_word: boolean;
  best_practice: string;
  poc: string;
  affected_target: string | string[];
  reference: string | string[];
  capec_owasp_cwe: string | string[];
  vulnerability_name: string;
  vulnerability_description: string;
  impact: string;
  recommendation: string;
  status: string;
  image_caption: string;
  category: string;
  cvss_score: number;
};

const ChecklistModal = ({
  data,
  dialogRef,
  templateId,
  triggerFetchProjectDetail,
}: {
  data?: ChecklistDetailT | null;
  dialogRef: React.RefObject<HTMLDialogElement>;
  templateId: string;
  triggerFetchProjectDetail: () => void;
}) => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    resetField,
  } = useForm<inputValuesT>();
  const dialogAddImageRef = useRef<HTMLDialogElement>(null);
  const [pocPreview, setPOCPreview] = useState<Image[]>([]);
  const [imagesFile, setImagesFile] = useState<FileList[]>([]);

  const onAddImageCaptionSubmit = async (image: { image_caption: string }) => {
    const res = await uploadPocImage(templateId, data?.id as string, {
      file: imagesFile[imagesFile.length - 1][0],
      caption: image.image_caption,
    });

    if (res.success) {
      setPOCPreview((prev) => [...prev, res.data] as never[]);
    }

    resetField('image_caption');
  };

  const onDeletePOCHandler = async (imageId: string) => {
    const res = await deletePOCImage(templateId, data?.id as string, imageId);

    if (res.success) {
      const imageIndex = pocPreview
        .map((image: Image) => image.id)
        .indexOf(imageId);

      const clonePoc = pocPreview.slice();
      clonePoc.splice(imageIndex, 1);
      setPOCPreview(() => clonePoc);
    }
  };

  const openAddImageModal = () => {
    dialogAddImageRef.current?.showModal();
  };

  const {
    fields: affected_target,
    remove: removeAffected_target,
    append: appendAffected_target,
  } = useFieldArray({
    control,
    name: 'affected_target',
  });

  const {
    fields: reference,
    remove: removeReferences,
    append: appendReferences,
  } = useFieldArray({
    control,
    name: 'reference',
  });

  const {
    fields: capec_owasp_cwe,
    remove: removeCapec,
    append: appendCapec,
  } = useFieldArray({
    control,
    name: 'capec_owasp_cwe',
  });

  const [baseScore, setBaseScore] = useState<number>();
  const [cvssValue, setCvssValue] = useState<cvss31ValueT>({
    AV: 'Network',
    S: 'Unchanged',
    AC: 'Low',
    PR: 'None',
    UI: 'None',
    C: 'None',
    I: 'None',
    A: 'None',
    severity_level: '',
  });
  const [severityLevel, setSeverityLevel] = useState<severityType>('');

  type severityType =
    | ''
    | 'Informational'
    | 'None'
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';

  useEffect(() => {
    if (data != null) {
      if (data.id != null) {
        const AV = data.attack_vector as
          | 'Network'
          | 'Adjacent'
          | 'Local'
          | 'Physical';
        const S = data.scope as 'Unchanged' | 'Changed';
        const AC = data.attack_complexity as 'Low' | 'High';
        const PR = data.privilege_required as 'None' | 'Low' | 'High';
        const UI = data.user_interaction as 'None' | 'Required';
        const C = data.confidentiality as 'None' | 'Low' | 'High';
        const I = data.integrity as 'None' | 'Low' | 'High';
        const A = data.availability as 'None' | 'Low' | 'High';

        setPOCPreview(data.images);
        setValue('affected_target', data.affected_target ?? ['']);
        setValue('reference', data.reference ?? ['']);
        setValue('capec_owasp_cwe', data.capec_owasp_cwe ?? ['']);
        setValue('title', data.title ?? '');
        setValue('progress', data.progress);
        setValue('description', data.description ?? '');
        setValue('best_practice', data.best_practice ?? '');
        setValue('vulnerability_name', data.vulnerability_name ?? '');
        setValue(
          'vulnerability_description',
          data.vulnerability_description ?? ''
        );
        setValue('image_caption', 'image caption');
        setSeverityLevel((data.severity_level as severityType) ?? '');
        setBaseScore(data.cvss_score);
        setValue('generate_to_word', data.generate_to_word);
        setValue('poc', data.poc ?? '');
        setValue('category', data.category ?? '');
        setValue('impact', data.impact ?? '');
        setValue('recommendation', data.recommendation ?? '');
        setValue('type', data.type ?? 'none');
        setCvssValue({
          AV,
          S,
          AC,
          PR,
          UI,
          C,
          I,
          A,
          severity_level: data.severity_level as
            | ''
            | 'High'
            | 'Low'
            | 'None'
            | 'Informational'
            | 'Medium'
            | 'Critical',
        });
      }
    }
  }, [data, setValue]);

  const fileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if ((e.target.files?.length as number) > 0) {
      setImagesFile((prev) => [...prev, e.target.files] as FileList[]);
      openAddImageModal();
    }
  };

  const onSaveHandler: SubmitHandler<inputValuesT> = async (
    input: checklistItemInputT
  ) => {
    let body = {
      ...input,
      affected_target:
        input.affected_target === '' ? [] : input.affected_target,
      reference: input.reference === '' ? [] : input.reference,
      capec_owasp_cwe:
        input.capec_owasp_cwe === '' ? [] : input.capec_owasp_cwe,
      progress: input.progress ? 1 : 0,
      severity_level: 'Informational',
    };

    if (input.type === 'vulnerability') {
      body = {
        ...body,
        attack_vector: cvssValue.AV ?? '',
        scope: cvssValue.S ?? '',
        attack_complexity: cvssValue.AC ?? '',
        privilege_required: cvssValue.PR ?? '',
        user_interaction: cvssValue.UI ?? '',
        confidentiality: cvssValue.C ?? '',
        integrity: cvssValue.I ?? '',
        availability: cvssValue.A ?? '',
        severity_level:
          severityLevel == 'None' ? 'Informational' : severityLevel,
        cvss_score: baseScore as number,
      };
    }

    console.log(body);

    const res = await updateChecklistItem(
      templateId as string,
      data?.id as string,
      body
    );

    if (res.success) triggerFetchProjectDetail();
  };

  return (
    <>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSaveHandler)}
      >
        <h1 className="font-bold text-2xl text-center mb-1">Edit Check List</h1>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Title</label>
            <input type="text" {...register('title')} />
          </div>
          <div className="flex items-end">
            <div className="">
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
        </div>
        <div className="flex gap-4 ">
          <label htmlFor="">Complete</label>
          <input
            {...register('progress')}
            type="checkbox"
            className="w-6 border border-[#d7d7d7] text-blue-500 bg-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea {...register('description')} />
        </div>
        <div className="flex gap-4 ">
          <label htmlFor="">Generate To Word</label>

          <input
            {...register('generate_to_word')}
            type="checkbox"
            className="w-6 border border-[#d7d7d7] text-blue-500 bg-blue-500"
          />
        </div>
        {watch('type') === 'vulnerability' ? (
          <>
            <div className="grid grid-cols-6 gap-6">
              <label htmlFor="" className="col-span-2">
                Vulnerability Name
              </label>
              <input
                type="text"
                className="col-span-4"
                {...register('vulnerability_name')}
              />
              <label htmlFor="" className="col-span-2">
                Vulnerability Description
              </label>
              <textarea
                id=""
                className="col-span-4 "
                {...register('vulnerability_description')}
              />
            </div>

            <CvssCalculator
              baseScore={baseScore as number}
              setBaseScore={setBaseScore as Dispatch<SetStateAction<number>>}
              cvssValue={cvssValue}
              setCvssValue={setCvssValue}
              severityLevel={severityLevel}
              setSeverityLevel={setSeverityLevel}
            />

            <div className="grid grid-cols-6 gap-6">
              <label htmlFor="" className="col-span-2">
                Status
              </label>
              <select
                {...register('status')}
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
                {affected_target.map((field, index) => {
                  return (
                    <div
                      key={`affectedTarget-${field.id}`}
                      className="flex  gap-8"
                    >
                      <input
                        key={field.id}
                        type="text"
                        {...register(`affected_target.${index}` as const)}
                        className=""
                      />
                      <button
                        type="button"
                        className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                        onClick={() => {
                          removeAffected_target(index);
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
                    appendAffected_target('');
                  }}
                  className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
                >
                  <span className="text-blue-500 text-sm font-bold">+</span> Add
                  Item
                </button>
              </div>

              <label htmlFor="category" className="col-span-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                {...register('category')}
                className="col-span-4"
              />
              {/* References */}
              <label htmlFor="" className="col-span-2">
                References
              </label>
              <div className="flex flex-col gap-2 col-span-4">
                {reference.map((field, index) => {
                  return (
                    <div key={`reference-${field.id}`} className="flex  gap-8">
                      <input
                        key={field.id}
                        type="text"
                        {...register(`reference.${index}` as const)}
                        className=""
                      />
                      <button
                        type="button"
                        className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                        onClick={() => {
                          removeReferences(index);
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
                    appendReferences('');
                  }}
                  className="py-2 px-3 gap-4  text-sm rounded-xl border border-[#D7D7D7] w-fit"
                >
                  <span className="text-blue-500 text-sm font-bold">+</span> Add
                  Item
                </button>
              </div>

              {/* CAPEC */}
              <label htmlFor="" className="col-span-2">
                CAPEC / CWE-ID /OWASP
              </label>
              <div className="flex flex-col gap-2 col-span-4">
                {capec_owasp_cwe.map((field, index) => {
                  return (
                    <div
                      key={`capec_owasp_cwe-${field.id}`}
                      className="flex  gap-8"
                    >
                      <input
                        key={field.id}
                        type="text"
                        {...register(`capec_owasp_cwe.${index}` as const)}
                        className=""
                      />
                      <button
                        type="button"
                        className="px-4 py-2 border border-[#d7d7d7] rounded-xl"
                        onClick={() => {
                          removeCapec(index);
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
                    appendCapec('');
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
              <textarea {...register('impact')} id="" className="col-span-4" />

              <label htmlFor="impact" className="col-span-2">
                Recommendation
              </label>
              <textarea
                {...register('recommendation')}
                id=""
                className="col-span-4"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <label htmlFor="description">Best Practice</label>
            <textarea {...register('best_practice')} />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Proof Of Concept</label>
          <textarea {...register('poc')} />
        </div>

        {/* imageInput */}
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
              accept="image/*"
              name="file_upload"
              className="hidden"
              onChange={fileHandler}
            />
          </label>
        </div>

        {data != undefined && pocPreview.length > 0 ? (
          <div key={'screenshot container'} className="flex gap-4 flex-wrap">
            {pocPreview.map(
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
                    <button
                      type="button"
                      className="absolute top-[-8px] right-[-12px] bg-red-500 px-1 py-1  font-bold rounded-full text-white"
                      onClick={() => {
                        onDeletePOCHandler(item.id);
                      }}
                    >
                      <X size={18}></X>
                    </button>
                    <img
                      src={`http://localhost:3000${item.file_path}`}
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

        <input
          onClick={() => {
            dialogRef.current?.close();
          }}
          type="submit"
          value="Save"
          className="border border-[#d7d7d7] bg-blue-500 hover:bg-blue-400 duration-300 cursor-pointer font-bold rounded-lg text-white py-2"
        />
      </form>

      <Modal dialogRef={dialogAddImageRef}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onAddImageCaptionSubmit)}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="">Image Caption</label>
            <input
              type="text"
              {...register('image_caption', { required: true })}
            />
          </div>
          <button
            onClick={() => {
              dialogAddImageRef.current?.close();
            }}
            className="border border-[#d7d7d7] w-full rounded-lg mt-2 bg-blue-500 font-bold  text-white py-2"
          >
            Add Image
          </button>
        </form>
      </Modal>
    </>
  );
};

export default ChecklistModal;
