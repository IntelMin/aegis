import { useState } from 'react';
import { showToast } from '@/components/toast';

const useAddressVerification = () => {
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);

  const checkAddress = async (address: string) => {
    setIsCheckingAddress(true);
    if (!address) {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'Please enter a valid contract address',
      });
      setIsCheckingAddress(false);
      return false;
    }
    if (address.slice(0, 2) !== '0x') {
      showToast({
        type: 'error',
        message: 'Error',
        description: 'Please enter a valid Ethereum contract address',
      });
      setIsCheckingAddress(false);
      return false;
    }
    try {
      const response = await fetch(`/api/token/check?token=${address}`);
      const data = await response.json();
      if (!data.address) {
        showToast({
          type: 'error',
          message: 'Error',
          description: 'Please enter a valid Ethereum contract address',
        });
      }
      setIsCheckingAddress(false);
      return data.address;
    } catch (error) {
      console.error('Error verifying address:', error);
      showToast({
        type: 'error',
        message: 'Error',
        description: 'Error verifying address',
      });
      setIsCheckingAddress(false);
      return false;
    }
  };

  return { checkAddress, isCheckingAddress };
};

export default useAddressVerification;
