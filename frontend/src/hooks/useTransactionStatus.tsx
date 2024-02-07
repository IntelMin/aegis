import { useEffect, useState } from 'react';
import { useWaitForTransaction } from 'wagmi';

interface TransactionStatus {
  transactionData: any;
  isTransactionError: string;
}

export function useTransactionStatus(hash: `0x${string}`): TransactionStatus {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isTransactionError, setIsTransactionError] = useState<string>('idle'); // Initialized with string 'false'

  // Use useWaitForTransaction to monitor the transaction
  const { data, status }  = useWaitForTransaction({ hash });

  useEffect(() => {
    if (data) {
      // Update transaction data when available
      setTransactionData(data);
    }
  }, [data]);

  useEffect(() => {
    // Update error state
    setIsTransactionError(status);
  }, [status]);


  // Expose the transaction status
  return { transactionData, isTransactionError };
}
