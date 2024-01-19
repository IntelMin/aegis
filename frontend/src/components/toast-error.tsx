import { toast } from 'sonner';

type Props = {
  message: string;
  description?: string;
};

export const showToastError = ({ message }: Props) => {
  toast.error(message, {
    style: {
      background: 'red',
      color: 'white',
    },
  });
};
