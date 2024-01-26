import React from 'react';
import { TableCell, TableRow } from '../ui/table';

type Props = {
  col: number;
  message: string;
};

export const EmptyRow = ({ col, message }: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={col} className="py-4 text-center">
        {message}
      </TableCell>
    </TableRow>
  );
};
