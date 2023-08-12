import React from 'react';

type cvssValueType = {
  AV: string;
  S: string;
  AC: string;
  C: string;
  PR: string;
  I: string;
  UI: string;
  A: string;
};

type setCvssValueType = React.Dispatch<
  React.SetStateAction<{
    AV: string;
    S: string;
    AC: string;
    C: string;
    PR: string;
    I: string;
    UI: string;
    A: string;
  }>
>;
const CvssCalculator = ({
  cvssValue,
  setCvssValue,
}: {
  cvssValue: cvssValueType;
  setCvssValue: setCvssValueType;
}) => {
  return (
    <div className="border border-[#d7d7d7] p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-xl">CVSS Calculator</p>
        <div className="bg-green-500 flex flex-col items-center pb-1 px-6 rounded-xl">
          <h4 className="font-bold text-white text-xl">0.0</h4>
          <p className="text-white text-sm">(None)</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Attack Vector (AV)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'N' };
                });
              }}
              className={`${
                cvssValue.AV === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Network (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'A' };
                });
              }}
              className={`${
                cvssValue.AV === 'A'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Adjecent (A)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  console.log('triggered');
                  return { ...prev, AV: 'L' };
                });
              }}
              className={`${
                cvssValue.AV === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Local (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'P' };
                });
              }}
              className={`${
                cvssValue.AV === 'P'
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
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, S: 'U' };
                });
              }}
              className={`${
                cvssValue.S === 'U'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Unchanged (U)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, S: 'C' };
                });
              }}
              className={`${
                cvssValue.S === 'C'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Changed (C)</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Attack Complexity (AC)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AC: 'L' };
                });
              }}
              className={`${
                cvssValue.AC === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AC: 'H' };
                });
              }}
              className={`${
                cvssValue.AC === 'H'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>High (H)</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Confidentiality (C)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'N' };
                });
              }}
              className={`${
                cvssValue.C === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'L' };
                });
              }}
              className={`${
                cvssValue.C === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'H' };
                });
              }}
              className={`${
                cvssValue.C === 'H'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>High (H)</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Previliges Required (PR)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'N' };
                });
              }}
              className={`${
                cvssValue.PR === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'L' };
                });
              }}
              className={`${
                cvssValue.PR === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'H' };
                });
              }}
              className={`${
                cvssValue.PR === 'H'
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
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'N' };
                });
              }}
              className={`${
                cvssValue.I === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'L' };
                });
              }}
              className={`${
                cvssValue.I === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'H' };
                });
              }}
              className={`${
                cvssValue.I === 'H'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>High (H)</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">User Interaction(UI)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, UI: 'N' };
                });
              }}
              className={`${
                cvssValue.UI === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, UI: 'R' };
                });
              }}
              className={`${
                cvssValue.UI === 'R'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Required (R)</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Availability (A)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'N' };
                });
              }}
              className={`${
                cvssValue.A === 'N'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'L' };
                });
              }}
              className={`${
                cvssValue.A === 'L'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'H' };
                });
              }}
              className={`${
                cvssValue.A === 'H'
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
            CVSS:3.1/AV:{cvssValue.AV}/AC:{cvssValue.AC}
            /PR:{cvssValue.PR}/UI:{cvssValue.UI}/S:{cvssValue.S}/C:
            {cvssValue.C}/I:{cvssValue.I}/A:{cvssValue.A}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CvssCalculator;
