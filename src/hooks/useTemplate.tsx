import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchTemplates } from '../utils/api.ts';

const useTemplates = <T,>(): [T | [], Dispatch<SetStateAction<T | []>>] => {
  const [value, setValue] = useState<T | []>([]);

  const triggerFetchTemplate = async () => {
    const result = (await fetchTemplates()).data.items as T;
    setValue(result);
  };

  useEffect(() => {
    triggerFetchTemplate();
  }, []);

  return [value, setValue];
};

export default useTemplates;
