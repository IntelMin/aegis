import { toast } from 'sonner';

type Props = {
  message: string;
  description?: string;
  type: 'success' | 'error';
};

export const showToast = ({ message, description, type }: Props) => {
  const toastOptions = {
    style: {
      background: type === 'success' ? 'green' : 'red',
      color: 'white',
    },
    description,
  };

  if (type === 'success') {
    toast.success(message, toastOptions);
  } else {
    toast.error(message, toastOptions);
  }
};
