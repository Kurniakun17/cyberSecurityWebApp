import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchProjects } from '../utils/helper.ts';

const useProjects = <T,>(): [T | [], Dispatch<SetStateAction<T | []>>] => {
  const [value, setValue] = useState<T | []>([]);

  const triggerFetchProject = async () => {
    const result = (await fetchProjects()).data.items as T;
    setValue(result);
  };

  useEffect(() => {
    triggerFetchProject();
  }, []);

  return [value, setValue];
};

export default useProjects;
