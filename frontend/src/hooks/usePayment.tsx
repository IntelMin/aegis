import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditType } from '@/lib/credit-config';
import { useSession } from 'next-auth/react';
import { showToast } from '@/components/toast';

const usePayment = () => {
  const session = useSession();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [isFetchingPaid, setIsFetchingPaid] = useState(true);

  const fetchPaidStatus = async (type: string, address: string | undefined) => {
    setIsFetchingPaid(true);
    try {
      const response = await axios.post('/api/credit/paid', {
        address: address || '',
        type,
      });
      console.log(`address: ${address}`);
      console.log(response.data);
      setHasPaid(response.data.paid);
    } catch (err) {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'There was an error fetching your payment status.',
      });
      setHasPaid(false);
    } finally {
      setIsFetchingPaid(false);
    }
  };

  const handlePayment = async (type: string, address: string | undefined) => {
    setIsProcessingPayment(true);
    try {
      const response = await axios.post('/api/credit/pay', { type, address });
      const data = response.data;

      if (data.status !== 'success') {
        showToast({
          type: 'error',
          message: 'Payment Error',
          description: data.message || 'Failed to process payment',
        });
      } else {
        showToast({
          type: 'success',
          message: 'Success',
          description: `Payment successful. You now have ${data.credits} credits remaining.`,
        });
        session.update({
          ...session.data,
          user: { ...session.data?.user, balance: data.credits },
        });
        setHasPaid(true);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        message: 'Payment Error',
        description:
          error.response?.data?.message || 'Failed to process payment',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return {
    fetchPaidStatus,
    handlePayment,
    isProcessingPayment,
    isFetchingPaid,
    hasPaid,
  };
};

export default usePayment;
