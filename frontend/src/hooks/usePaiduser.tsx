import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const usePaidUser = (contractAddress: string) => {
  const [paidUser, setPaidUser] = useState(null);
  const router = useRouter();

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
      console.log(paidUserResponse);
      setPaidUser(paidUserResponse.paiduser);
    };
    fetchPaidUser();
  }, [contractAddress]);

  return paidUser;
};

export default usePaidUser;
