import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useItemDetail = <T,>(
  fetchFn: () => Promise<T>
): [T | null, Dispatch<SetStateAction<T | null>>, () => void] => {
  const [value, setValue] = useState<T | null>(null);

  const triggerFetchItemDetail = async () => {
    const result = await fetchFn();
    
    setValue({ ...result });
  };

  useEffect(() => {
    triggerFetchItemDetail();
  }, []);

  return [value, setValue, triggerFetchItemDetail];
};

export default useItemDetail;
