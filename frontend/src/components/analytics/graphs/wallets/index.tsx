import React from 'react';
import WalletBubble from './bubble';
import WalletTable from './table';

type Props = {};

const WalletsGraph = (props: Props) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col col-span-2 md:col-span-1">
        <WalletBubble />
      </div>
      <WalletTable />
    </div>
  );
};

export default WalletsGraph;
