import React from "react";
import Image from "next/image";

type Props = {};

const TokenValue = (props: Props) => {
  const demoarr = [
    {
      value: "$8.49M",
      key: "Market Cap",
    },
    {
      value: "$407.15K",
      key: "LIQUIDITY",
    },
    {
      value: "$4.28M",
      key: "VOLUME (24H)",
    },
    {
      value: "$3.82K",
      key: "HOLDERS",
    },
    {
      value: "231d ago",
      key: "CREATED",
    },
  ];
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-neutral-50 text-[28px] leading-[40px] font-[700]">
          $1.16
        </h1>
        <div className="flex items-center">
          <Image
            src="/token-icons/profitIcon.svg"
            alt="profit"
            width={7}
            height={7}
          />
          <h5 className="text-green-600">3.36%</h5>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center flex-col">
          <div className="flex items-center gap-3">
            <p className="text-neutral-100 text-[14px] w-[70px] text-right">
              OSMO:{" "}
            </p>
            <div className="flex items-center gap-[4px]">
              <p className="text-blue-400 text-[14px] leading-[20px]">
                0x34e...45rty
              </p>
              <button>
                <Image
                  src="/token-icons/copy.svg"
                  alt="network-icon"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-neutral-100 text-[14px] w-[70px] text-right">
              PAIR:{" "}
            </p>
            <div className="flex items-center gap-[4px]">
              <p className="text-blue-400 text-[14px] leading-[20px]">
                0x34e...45rty
              </p>
              <button>
                <Image
                  src="/token-icons/copy.svg"
                  alt="network-icon"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        </div>
        {demoarr?.map((item) => (
          <div key={item?.key} className="bg-zinc-900 px-4 py-[6px]">
            <h1 className="text-neutral-200 text-[16px] font-[600] text-center">
              {item?.value}
            </h1>
            <p className="uppercase text-neutral-500 text-[10px] font-[400] text-center">
              {item?.key}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenValue;
