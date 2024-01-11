import React from 'react';

const columns = [
  { label: 'Type' },
  { label: 'Name' },
  { label: 'Mutability' },
  { label: 'Visibility' },
];

export type DataProps = {
  key: number;
  type: string | null;
  name: string | null;
  mutating: string | null;
  spec: string | null;
};

const dummyData = [
  {
    type: 'Contract',
    name: 'ERC20',
    mutating: 'Immutable',
    visibility: 'Interface',
  },
  {
    type: 'Contract2',
    name: 'ERC20',
    mutating: 'Immutable',
    visibility: 'Interface',
  },
  {
    type: 'Contract4',
    name: 'ERC20',
    mutating: 'Immutable',
    visibility: 'External',
  },
  {
    type: 'Contract3',
    name: 'ERC20',
    mutating: 'Immutable',
    visibility: 'External',
  },
];

type Props = {
  data: DataProps[] | null;
};

const FunctionReport = ({ data }: Props) => {
  return (
    <div className="flex justify-center p-6 w-full">
      <div className="border border-zinc-800 p-3 overflow-x-auto md:w-[80%]">
        <table className="w-full max-md:w-[520px]">
          <tr className="grid grid-cols-5 w-full bg-zinc-900 py-2 px-[6px]">
            {columns?.map((item, i) => (
              <th
                key={item?.label}
                className={`uppercase ${
                  i === 1 ? 'col-span-2' : 'col-span-1'
                } text-neutral-400 text-[13px] font-[400] text-left`}
              >
                {item?.label}
              </th>
            ))}
          </tr>
          {data?.map((item: DataProps, i: number) => (
            <tr
              key={item?.key}
              className={`grid grid-cols-5 w-full py-4 px-[6px] ${
                i !== data?.length - 1 ? 'border-b border-zinc-800' : ''
              }`}
            >
              <td className="col-span-1 text-neutral-200 text-left text-[14px]">
                {item?.type}
              </td>
              <td className="col-span-2 text-neutral-200 text-left text-[14px]">
                {item?.name}
              </td>
              <td className="col-span-1 text-neutral-200 text-left text-[14px]">
                {item?.mutating}
              </td>
              <td className="col-span-1 text-neutral-200 text-left text-[14px]">
                {item?.spec}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default FunctionReport;
