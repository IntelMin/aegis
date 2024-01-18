import React from 'react';

const ClusterHold = () => {
  return (
    <table className="w-full mt-3 bg-zinc-700">
      <tr className="w-full  border-zinc-600 grid grid-cols-8"></tr>
      <div className="overflow-y-scroll h-[310px]">
        {[1, 2, 3, 4, 5, 6, 7, 8]?.map(item => (
          <tr
            key={item}
            className={`w-full my-2 grid grid-cols-10 items-center p-2 ${
              item % 2 !== 0 ? 'bg-[#0B0B0B]' : 'bg-transparent'
            }`}
          >
            <td className="col-span-1 text-sm text-neutral-500">{item}</td>
            <td className="col-span-3 text-sm text-white text-left">Holder</td>
            <td className="col-span-3 text-sm text-neutral-100 text-center border-[1px] border-red-900 w-[50px]">
              32%
            </td>
            <td className="col-span-3 text-white text-sm text-left">
              10 Wallets
            </td>
          </tr>
        ))}
      </div>
    </table>
  );
};

export default ClusterHold;
