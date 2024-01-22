import { useState, useEffect } from 'react';

const useBalance = (email: string) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const getBalance = async () => {
      const res = await fetch('/api/credit/balance', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await res.json();
      setBalance(data?.balance);
    };

    if (email) {
      getBalance();
    }
  }, [email]);

  return { balance, setBalance };
};

export default useBalance;
