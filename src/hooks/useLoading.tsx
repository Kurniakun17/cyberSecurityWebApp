import { useState } from 'react';

const useLoading = <T,>(fn?: () => Promise<T>) => {
  const [loading, setLoading] = useState(false);

  const trigger = async () => {
    try {
      if (fn) {
        setLoading(true);
        await fn();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return [loading && fn, trigger];
};

export default useLoading;
