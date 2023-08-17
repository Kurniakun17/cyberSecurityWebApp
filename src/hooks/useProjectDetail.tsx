import { useEffect, useState } from 'react';
import { fetchProjectDetail } from '../utils/helper';

const useProjectDetail = <T,>(id: string): [T | null, () => void] => {
  const [value, setValue] = useState<T | null>(null);

  const triggerFetchProjectDetail = async () => {
    const result = (await fetchProjectDetail(id)).data as T;
    setValue({ ...result });
  };

  useEffect(() => {
    triggerFetchProjectDetail();
  }, []);

  return [value, triggerFetchProjectDetail];
};

export default useProjectDetail;
