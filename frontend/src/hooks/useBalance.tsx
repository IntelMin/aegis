import { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast } from '@/components/toast';

const useBalance = () => {
  const [balance, setBalance] = useState(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);

  useEffect(() => {
    const getBalance = async () => {
      setIsFetchingBalance(true);
      try {
        const response = await axios.get('/api/credit/balance');
        setBalance(response.data.balance);
      } catch (error: any) {
        showToast({
          type: 'error',
          message: 'Balance Error',
          description: 'Error fetching balance',
        });
      } finally {
        setIsFetchingBalance(false);
      }
    };

    getBalance();
  }, []);

  return { balance, isFetchingBalance };
};

export default useBalance;
