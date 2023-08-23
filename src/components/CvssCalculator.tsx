import React, { useEffect } from 'react';
import { cvss31ValueT } from '../utils/types';

type setCvssValueType = React.Dispatch<React.SetStateAction<cvss31ValueT>>;
const CvssCalculator = ({
  baseScore,
  setBaseScore,
  cvssValue,
  setCvssValue,
}: {
  baseScore: number;
  setBaseScore: React.Dispatch<React.SetStateAction<number>>;
  cvssValue: cvss31ValueT;
  setCvssValue: setCvssValueType;
}) => {
  let iss;
  let impact;
  let exploitability;
  const exploitabilityCoefficient = 8.22;
  const scopeCoefficient = 1.08;

  const baseScoreStatus = () => {
    const res = severityRatings.filter(
      (item) => baseScore >= item.bottom && baseScore <= item.top
    );
    console.log(res[0].name);
    return res[0].name;
  };

  const updateBaseScore = () => {
    const WeightC = CVSS31Weight.C[cvssValue.C];
    iss =
      1 -
      (1 - WeightC) *
        (1 - CVSS31Weight.I[cvssValue.I]) *
        (1 - CVSS31Weight.A[cvssValue.A]);

    if (cvssValue.S === 'U') {
      impact = CVSS31Weight['S'][cvssValue.S] * iss;
    } else {
      impact =
        CVSS31Weight['S'][cvssValue.S] * (iss - 0.029) -
        3.25 * Math.pow(iss - 0.02, 15);
    }

    exploitability =
      exploitabilityCoefficient *
      CVSS31Weight.AV[cvssValue.AV] *
      CVSS31Weight.AC[cvssValue.AC] *
      CVSS31Weight.PR[cvssValue.S][cvssValue.PR] *
      CVSS31Weight.UI[cvssValue.UI];

    if (impact <= 0) {
      setBaseScore(0);
    } else {
      if (cvssValue.S === 'U') {
        setBaseScore(Roundup(Math.min(exploitability + impact, 10)));
      } else {
        setBaseScore(
          Roundup(Math.min(scopeCoefficient * (exploitability + impact), 10))
        );
      }
    }
  };

  useEffect(() => {
    updateBaseScore();
  }, [cvssValue]);

  return (
    <div className="border border-[#d7d7d7] p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-xl">CVSS Calculator</p>
        <div
          className={`${
            colorRatings[
              baseScoreStatus() as
                | 'None'
                | 'Low'
                | 'Medium'
                | 'High'
                | 'Critical'
            ]
          } flex flex-col items-center pb-1 px-6 rounded-xl w-[108px]`}
        >
          <h4 className="font-bold text-white text-xl">{baseScore}</h4>
          <p className="text-white text-sm">( {baseScoreStatus()} )</p>
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

function Roundup(input: number) {
  const int_input = Math.round(input * 100000);
  if (int_input % 10000 === 0) {
    return int_input / 100000;
  } else {
    return (Math.floor(int_input / 10000) + 1) / 10;
  }
}

const colorRatings = {
  None: 'bg-[#53aa33]',
  Low: 'bg-[#ffcb0d]',
  Medium: 'bg-[#f9a009]',
  High: 'bg-[#df3d03]',
  Critical: 'bg-[#cc0500]',
};

const severityRatings = [
  {
    name: 'None',
    bottom: 0.0,
    top: 0.0,
  },
  {
    name: 'Low',
    bottom: 0.1,
    top: 3.9,
  },
  {
    name: 'Medium',
    bottom: 4.0,
    top: 6.9,
  },
  {
    name: 'High',
    bottom: 7.0,
    top: 8.9,
  },
  {
    name: 'Critical',
    bottom: 9.0,
    top: 10.0,
  },
];

export const CVSS31Weight: Cvss31WeightType = {
  AV: {
    N: 0.85,
    A: 0.62,
    L: 0.55,
    P: 0.2,
  },
  AC: {
    H: 0.44,
    L: 0.77,
  },
  PR: {
    U: {
      N: 0.85,
      L: 0.62,
      H: 0.27,
    },
    C: {
      N: 0.85,
      L: 0.68,
      H: 0.5,
    },
  },
  UI: {
    N: 0.85,
    R: 0.62,
  },
  S: {
    U: 6.42,
    C: 7.52,
  },
  C: {
    N: 0,
    L: 0.22,
    H: 0.56,
  },
  I: {
    N: 0,
    L: 0.22,
    H: 0.56,
  },
  A: {
    N: 0,
    L: 0.22,
    H: 0.56,
  },
};

type Cvss31WeightType = {
  AV: {
    N: 0.85;
    A: 0.62;
    L: 0.55;
    P: 0.2;
  };
  AC: {
    H: 0.44;
    L: 0.77;
  };
  PR: {
    U: {
      N: 0.85;
      L: 0.62;
      H: 0.27;
    };
    C: {
      N: 0.85;
      L: 0.68;
      H: 0.5;
    };
  };
  UI: {
    N: 0.85;
    R: 0.62;
  };
  S: {
    U: 6.42;
    C: 7.52;
  };
  C: {
    N: 0;
    L: 0.22;
    H: 0.56;
  };
  I: {
    N: 0;
    L: 0.22;
    H: 0.56;
  };
  A: {
    N: 0;
    L: 0.22;
    H: 0.56;
  };
};
