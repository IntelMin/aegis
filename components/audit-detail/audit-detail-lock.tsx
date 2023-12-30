import Image from "next/image";
import React from "react";
import TemplateSection from "./template-section";

type Props = {
  params: {
    id: string;
  };
};

const AuditDetailLock = ({ params }: Props) => {
  return (
    <div className="w-full flex flex-col text-white">
      <div className="flex justify-center items-center w-full h-[240px] relative">
        {/* Token Name */}
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center gap-3">
            <Image src="/aaveIcon.svg" alt="token-icon" width={40} height={40}
            />
            <h3 className="text-neutral-50 text-[32px]">Aave</h3>
            <p className="text-neutral-300 text-[24px] font-[300]">$AAVE</p>
          </div>
          <p className="text-blue-400 text-[16px] font-[300] px-4 py-2">
            {params?.id}
          </p>
        </div>
      </div>
      <div className="py-4 w-full px-10 flex flex-col gap-6">
        <div className="grid grid-cols-11 gap-5">
          <TemplateSection title="Functions" imgSrc="/functions.png" imgAlt="info-icon"
          />
          <TemplateSection title="Dependency" imgSrc="/dependency.png" imgAlt="info-icon"
          />
        </div>
        <div className="grid grid-cols-11 gap-5">
          <div className="col-span-11 flex flex-col gap-3">
            <h1>Code</h1>
            <div className="border border-zinc-800 relative">
              <Image src="/code.png" alt="code-bg" width={500} height={400} className="w-full h-[90%]"
              />
              <div className={`absolute left-0 top-0 h-full w-full`}>
                <div
                  className="flex flex-col items-center justify-center p-5 gap-2 h-full"
                  style={{
                    background: "rgba(12, 12, 12, 0.20)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <button
                    type="button"
                    className="bg-[#0E76FD] font-[300] text-white px-12 py-3"
                  >
                    Unlock
                  </button>
                  <p className="text-[14px] text-neutral-300">
                    Unlock the full function list with premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailLock;
