"use client";

import Title from "@/components/title";
import React from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import SecurityScore from "./SecurityScore";
import AuditHistory from "./AuditHistory";
import { LuIceCream } from "react-icons/lu";
import { Button, Chip } from "@nextui-org/react";

type Props = {};

const CodeSecurity = (code: any, rugpull: any) => {

  

  return (
    <div className="mt-3 rounded-lg">
      <div className="flex flex-col justify-start gap-2 md:flex-row md:justify-between md:items-center">
        <Title title="Code Security" icon={false} />
        <p className="text-[14px] text-[#b0b0b0] font-semibold">
          Last Audit: 8th Oct, 2023
        </p>
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-3 gap-6 mt-3">
          <AuditHistory />
          <div className="p-6 space-y-6 text-white bg-gray-800 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">Methods</h3>
              <div className="flex gap-4 mt-3">
                <Button color="primary" radius="md">
                  AI Review
                </Button>
                <Button color="secondary" radius="md" >
                  Static Analysis
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Audited Files</h3>
              <div className="mt-3 space-y-3">
                {/* Repeat for each file */}
                <div className="flex items-center justify-between">
                  <span className="font-mono">mod.rs</span>
                  <div className="flex items-center">
                    <span>904...6F1</span>
                    <LuIceCream size={20} className="ml-2" />
                  </div>
                </div>
                {/* ... */}
              </div>
              <Button color="primary" className="mt-3">
                View 8 Audited Files
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Audit Timeline</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-center">
                  <LuIceCream size={20} />
                  <span className="ml-2">Requested on 10/03/2023</span>
                </div>
                <div className="flex items-center">
                  <LuIceCream size={20} />
                  <span className="ml-2">Revised on 27/05/2023</span>
                </div>
              </div>
            </div>
          </div>
          <SecurityScore />
        </div>
      </div>
    </div>
  );
};

export default CodeSecurity;
