import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { creditConfig, CreditType } from '@/lib/credit-config';
import { useSession } from 'next-auth/react';
import { showToast } from '@/components/toast';

interface usePaymentProps {
  address?: string;
  balance: number | null;
  onSuccess?: () => void;
}
const usePayment = ({ address, balance, onSuccess }: usePaymentProps) => {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const handlePayment = async (type: CreditType) => {
    if (session.status === 'unauthenticated') {
      router.push('/login');
      return new Error('Not authenticated');
    }
    if (!session.data) {
      return new Error('Not authenticated');
    }

    const cost = creditConfig[type];
    if (!balance || balance === 0 || balance < cost) {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'You do not have enough credits to perform this action',
      });

      return new Error('Not enough credits');
    }
    setLoading(true);
    const res = await fetch('/api/credit/pay', {
      method: 'POST',
      body: JSON.stringify({
        type: type,
        address: address ? address : '',
      }),
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'There was an error with your payment',
      });

      setLoading(false);

      return new Error('Credit payment error');
    }
    if (data?.status === 'success') {
      showToast({
        type: 'success',
        message: 'Success',
        description: 'Payment successful',
      });
      session.update({
        ...session.data,
        user: {
          ...session.data?.user,
          balance: data?.balance,
          paid_code: true,
        },
      });
      if (onSuccess) {
        onSuccess(); // Call onSuccess callback if provided
      }
      setLoading(false);
    } else {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'There was an error with your payment',
      });

      return new Error('Credit payment error');
    }
  };

  return { handlePayment, loading };
};

export default usePayment;
