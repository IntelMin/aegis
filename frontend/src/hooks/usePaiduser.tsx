import { useState, useEffect } from 'react';

const usePaidUser = (contractAddress: string) => {
  const [paidUser, setPaidUser] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPaidUser = async () => {
      const response = await fetch('/api/credit/paidaudit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: contractAddress,
          type: 'detailed',
        }),
      });
      const paidUserResponse = await response.json();
      console.log({ paidUserResponse });
      if (paidUserResponse.status === 'error') {
        setPaidUser(false);
        return;
      }
      setPaidUser(paidUserResponse.paiduser);
    };
    fetchPaidUser();
  }, [contractAddress]);

  return paidUser;
};

export default usePaidUser;
