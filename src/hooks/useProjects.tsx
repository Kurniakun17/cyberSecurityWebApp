import { useEffect, useState } from 'react';
import { fetchProjects } from '../utils/helper.ts';
import { projectsType } from '../utils/types.ts';

const useProjects = () => {
  const [value, setValue] = useState<projectsType[]>([]);

  const triggerFetchProject = async () => {
    const result = (await fetchProjects()).data.items;
    setValue(result);
  };

  useEffect(() => {
    triggerFetchProject();
  }, []);

  return [value, setValue];
};

export default useProjects;
