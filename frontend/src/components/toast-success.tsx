import { toast } from 'sonner';

type Props = {
  message: string;
  description?: string;
};

export const showToastSuccess = ({ message }: Props) => {
  toast.success(message, {
    style: {
      background: 'green',
      color: 'white',
    },
  });
};
