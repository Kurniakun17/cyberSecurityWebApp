import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchProjectDetail } from '../utils/helper';

const useProjectDetail = <T,>(
  id: string
): [T | null, Dispatch<SetStateAction<T | null>>, () => void] => {
  const [value, setValue] = useState<T | null>(null);

  const triggerFetchProjectDetail = async () => {
    const result = (await fetchProjectDetail(id)).data as T;
    setValue({ ...result });
  };

  useEffect(() => {
    triggerFetchProjectDetail();
  }, []);

  return [value, setValue, triggerFetchProjectDetail];
};

export default useProjectDetail;
