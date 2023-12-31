import { useEffect, useState } from 'react';
import { fetchTemplates } from '../utils/api.ts';

const useTemplates = <T,>(): [
  T | [],
  number,
  (pageCount: number, sizeCount: number) => void
] => {
  const [value, setValue] = useState<T | []>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const limit = 8;

  const triggerFetchTemplate = async (pageCount: number, sizeCount: number) => {
    const result: { totalPages: number; items: T } = (
      await fetchTemplates(pageCount, sizeCount)
    ).data;

    setTotalPage(result.totalPages as number);
    setValue(result.items);
  };

  useEffect(() => {
    triggerFetchTemplate(0, limit);
  }, []);

  return [value, totalPage, triggerFetchTemplate];
};

export default useTemplates;
