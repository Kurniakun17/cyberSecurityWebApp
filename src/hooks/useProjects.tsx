import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchProjects } from '../utils/api.ts';

const useProjects = <T,>({
  type,
}: {
  type: string;
}): [
  T | [],
  Dispatch<SetStateAction<T | []>>,
  number,
  (pageCount: number, sizeCount: number, type: string) => void
] => {
  const [value, setValue] = useState<T | []>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const limit = 2;

  const triggerFetchProject = async (
    pageCount: number,
    sizeCount: number,
    type: string
  ) => {
    const result: { totalPages: number; items: T } = (
      await fetchProjects(pageCount, sizeCount, type)
    ).data;

    setTotalPage(result['totalPages'] as number);
    setValue(result.items);
  };

  useEffect(() => {
    triggerFetchProject(0, limit, type);
  }, []);

  return [value, setValue, totalPage, triggerFetchProject];
};

export default useProjects;
