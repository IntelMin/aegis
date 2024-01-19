import { toast } from 'sonner';

type Props = {
  message: string;
  description?: string;
};

export const showToastError = ({ message, description }: Props) => {
  toast.error(message, {
    description,
    style: {
      background: 'red',
      color: 'white',
    },
  });
};
