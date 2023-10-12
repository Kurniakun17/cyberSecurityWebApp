import React, { useEffect } from 'react';
import { cvss31ValueT } from '../utils/types';
import { colorRatings, severityRatings } from '../utils/cvss';

type setCvssValueType = React.Dispatch<React.SetStateAction<cvss31ValueT>>;
const CvssCalculator = ({
  baseScore,
  setBaseScore,
  cvssValue,
  setCvssValue,
  severityLevel,
  setSeverityLevel,
}: {
  baseScore: number;
  setBaseScore: React.Dispatch<React.SetStateAction<number>>;
  cvssValue: cvss31ValueT;
  setCvssValue: setCvssValueType;
  severityLevel: string;
  setSeverityLevel: React.Dispatch<
    React.SetStateAction<
      '' | 'Informational' | 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
    >
  >;
}) => {
  let iss;
  let impact;
  let exploitability;
  const exploitabilityCoefficient = 8.22;
  const scopeCoefficient = 1.08;

  const updateSeverityLevel = () => {
    if (baseScore != null) {
      const res = severityRatings.filter(
        (item) => baseScore >= item.bottom && baseScore <= item.top
      );

      let severityName = res[0].name as
        | ''
        | 'None'
        | 'Low'
        | 'Medium'
        | 'High'
        | 'Critical';

      if (
        !(
          cvssValue.AV &&
          cvssValue.AC &&
          cvssValue.PR &&
          cvssValue.S &&
          cvssValue.UI &&
          cvssValue.C &&
          cvssValue.I &&
          cvssValue.A
        )
      ) {
        severityName = '';
      }

      setSeverityLevel(severityName);
    }
  };

  const updateBaseScore = () => {
    const WeightC = CVSS31Weight.C[cvssValue.C];
    iss =
      1 -
      (1 - WeightC) *
        (1 - CVSS31Weight.I[cvssValue.I]) *
        (1 - CVSS31Weight.A[cvssValue.A]);

    if (cvssValue.S === 'Unchanged') {
      impact = CVSS31Weight.S[cvssValue.S] * iss;
    } else {
      impact =
        CVSS31Weight.S[cvssValue.S] * (iss - 0.029) -
        3.25 * Math.pow(iss - 0.02, 15);
    }

    exploitability =
      exploitabilityCoefficient *
      CVSS31Weight.AV[cvssValue.AV] *
      CVSS31Weight.AC[cvssValue.AC] *
      CVSS31Weight.PR[cvssValue.S][cvssValue.PR] *
      CVSS31Weight.UI[cvssValue.UI];

    if (impact <= 0) {
      updateSeverityLevel();
      setBaseScore(0.0);
    } else {
      if (cvssValue.S === 'Unchanged') {
        setBaseScore(Roundup(Math.min(exploitability + impact, 10)));
      } else {
        setBaseScore(
          Roundup(Math.min(scopeCoefficient * (exploitability + impact), 10))
        );
      }
    }
  };

  useEffect(() => {
    if (
      cvssValue.AV &&
      cvssValue.AC &&
      cvssValue.PR &&
      cvssValue.S &&
      cvssValue.UI &&
      cvssValue.C &&
      cvssValue.I &&
      cvssValue.A
    ) {
      updateBaseScore();
    }
  }, [cvssValue, setCvssValue]);

  useEffect(() => {
    if (baseScore != null) {
      updateSeverityLevel();
    }
  }, [baseScore]);

  return (
    <div className="border border-[#d7d7d7] p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-xl">CVSS Calculator</p>
        <div
          className={`${
            colorRatings[
              severityLevel as 'None' | 'Low' | 'Medium' | 'High' | 'Critical'
            ]
          } flex flex-col items-center pb-1 px-6 rounded-xl min-w-[108px]`}
        >
          <h4 className="font-bold text-white text-xl">{baseScore}</h4>
          <p className="text-white text-sm">
            (
            {severityLevel === ''
              ? 'Please fill all of the available options'
              : severityLevel}
            )
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-4">
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-blue-500">Attack Vector (AV)</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'Network' };
                });
              }}
              className={`${
                cvssValue.AV === 'Network'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Network (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'Adjacent' };
                });
              }}
              className={`${
                cvssValue.AV === 'Adjacent'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Adjecent (A)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'Local' };
                });
              }}
              className={`${
                cvssValue.AV === 'Local'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Local (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AV: 'Physical' };
                });
              }}
              className={`${
                cvssValue.AV === 'Physical'
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
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, S: 'Unchanged' };
                });
              }}
              className={`${
                cvssValue.S === 'Unchanged'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Unchanged (U)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, S: 'Changed' };
                });
              }}
              className={`${
                cvssValue.S === 'Changed'
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
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AC: 'Low' };
                });
              }}
              className={`${
                cvssValue.AC === 'Low'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, AC: 'High' };
                });
              }}
              className={`${
                cvssValue.AC === 'High'
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
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'None' };
                });
              }}
              className={`${
                cvssValue.C === 'None'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'Low' };
                });
              }}
              className={`${
                cvssValue.C === 'Low'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, C: 'High' };
                });
              }}
              className={`${
                cvssValue.C === 'High'
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
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'None' };
                });
              }}
              className={`${
                cvssValue.PR === 'None'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'Low' };
                });
              }}
              className={`${
                cvssValue.PR === 'Low'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, PR: 'High' };
                });
              }}
              className={`${
                cvssValue.PR === 'High'
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
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'None' };
                });
              }}
              className={`${
                cvssValue.I === 'None'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'Low' };
                });
              }}
              className={`${
                cvssValue.I === 'Low'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, I: 'High' };
                });
              }}
              className={`${
                cvssValue.I === 'High'
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
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, UI: 'None' };
                });
              }}
              className={`${
                cvssValue.UI === 'None'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, UI: 'Required' };
                });
              }}
              className={`${
                cvssValue.UI === 'Required'
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
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'None' };
                });
              }}
              className={`${
                cvssValue.A === 'None'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>None (N)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'Low' };
                });
              }}
              className={`${
                cvssValue.A === 'Low'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-[#d7d7d7] text-black'
              } border p-1 px-2 rounded-md`}
            >
              <p>Low (L)</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setCvssValue((prev) => {
                  return { ...prev, A: 'High' };
                });
              }}
              className={`${
                cvssValue.A === 'High'
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
              attack_vector: cvssValue.AV,
              attack_complexity: cvssValue.C,
              privilege_required: cvssValue.PR,
              user_interaction: cvssValue.UI,
              scope: cvssValue.S,
              confidentiality: cvssValue.C,
              integrity: cvssValue.I,
              availability: cvssValue.A,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CvssCalculator;

const generateVectorString = ({
  attack_vector,
  attack_complexity,
  privilege_required,
  user_interaction,
  scope,
  confidentiality,
  integrity,
  availability,
}: {
  attack_vector: string;
  attack_complexity: string;
  privilege_required: string;
  user_interaction: string;
  scope: string;
  confidentiality: string;
  integrity: string;
  availability: string;
}) => {
  if (
    attack_vector &&
    attack_complexity &&
    privilege_required &&
    scope &&
    user_interaction &&
    confidentiality &&
    integrity &&
    availability
  )
    return `CVSS:3.1/AV:${attack_vector[0]}/AC:${attack_complexity[0]}/PR:${privilege_required[0]}/UI:${user_interaction[0]}/S:${scope[0]}/C:${confidentiality[0]}/I:${integrity[0]}/A:${availability[0]}`;
  return `Please select all of the available options to generate vector string`;
};

function Roundup(input: number) {
  const int_input = Math.round(input * 100000);
  if (int_input % 10000 === 0) {
    return int_input / 100000;
  } else {
    return (Math.floor(int_input / 10000) + 1) / 10;
  }
}

export const CVSS31Weight: Cvss31WeightType = {
  AV: {
    Network: 0.85,
    Adjacent: 0.62,
    Local: 0.55,
    Physical: 0.2,
  },
  AC: {
    High: 0.44,
    Low: 0.77,
  },
  PR: {
    Unchanged: {
      None: 0.85,
      Low: 0.62,
      High: 0.27,
    },
    Changed: {
      None: 0.85,
      Low: 0.68,
      High: 0.5,
    },
  },
  UI: {
    None: 0.85,
    Required: 0.62,
  },
  S: {
    Unchanged: 6.42,
    Changed: 7.52,
  },
  C: {
    None: 0,
    Low: 0.22,
    High: 0.56,
  },
  I: {
    None: 0,
    Low: 0.22,
    High: 0.56,
  },
  A: {
    None: 0,
    Low: 0.22,
    High: 0.56,
  },
};

type Cvss31WeightType = {
  AV: {
    Network: 0.85;
    Adjacent: 0.62;
    Local: 0.55;
    Physical: 0.2;
  };
  AC: {
    High: 0.44;
    Low: 0.77;
  };
  PR: {
    Unchanged: {
      None: 0.85;
      Low: 0.62;
      High: 0.27;
    };
    Changed: {
      None: 0.85;
      Low: 0.68;
      High: 0.5;
    };
  };
  UI: {
    None: 0.85;
    Required: 0.62;
  };
  S: {
    Unchanged: 6.42;
    Changed: 7.52;
  };
  C: {
    None: 0;
    Low: 0.22;
    High: 0.56;
  };
  I: {
    None: 0;
    Low: 0.22;
    High: 0.56;
  };
  A: {
    None: 0;
    Low: 0.22;
    High: 0.56;
  };
};

export { generateVectorString };
