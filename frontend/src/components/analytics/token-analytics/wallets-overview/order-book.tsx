import React from 'react';
import { GraphTypeHeader } from './graph-type-header';
import { OrderBookGraph } from './order-book-graph';

type Props = {
  choosenType: string;
  handleTypeChange: (value: string) => void;
};

export const OrderBook = ({ choosenType, handleTypeChange }: Props) => {
  return (
    <div className="w-full space-y-2">
      <GraphTypeHeader
        choosenType={choosenType}
        handleTypeChange={handleTypeChange}
      />
      <OrderBookGraph />
    </div>
  );
};
