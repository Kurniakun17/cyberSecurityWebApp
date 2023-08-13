import { useEffect, useState } from 'react';
import { fetchProjectDetail } from '../utils/helper';
import { projectDetail } from '../utils/types.ts';

const useProjectDetail = (id: string) => {
  const [value, setValue] = useState<projectDetail[]>([]);

  const triggerFetchProject = async () => {
    const result = (await fetchProjectDetail(id)).data;
    console.log(result);
    setValue(result);
  };

  useEffect(() => {
    triggerFetchProject();
  }, []);

  return [value, setValue];
};

export default useProjectDetail;
