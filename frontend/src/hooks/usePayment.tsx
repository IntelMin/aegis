import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

import { creditConfig, CreditType } from '@/lib/credit-config';
import { ToasterToast } from '@/components/ui/use-toast';

interface usePaymentProps {
  session: {
    data: Session | null;
    update: (data?: any) => Promise<Session | null>;
    status: 'authenticated' | 'loading' | 'unauthenticated';
  };
  address?: string;
  balance: number | null;
  onSuccess?: () => void;
  toast: (props: ToasterToast) => void;
}
const usePayment = ({
  session,
  address,
  balance,
  onSuccess,
  toast,
}: usePaymentProps) => {
  const router = useRouter();
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
      toast({
        id: 'not-enough-credits',
        variant: 'destructive',
        title: 'Error',
        description: 'Not enough credits',
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
    if (data?.status === 'success') {
      toast({
        id: 'payment-success',
        variant: 'default',
        title: 'Success',
        description: 'Payment success',
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
      setLoading(false);
      toast({
        id: 'payment-error',
        variant: 'destructive',
        title: 'Error',
        description: 'Credit payment error',
      });

      return new Error('Credit payment error');
    }
  };

  return { handlePayment, loading };
};

export default usePayment;
