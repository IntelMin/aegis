"use client"
import React, { use } from "react";
import Title from "../title";
import { AiOutlineLock } from "react-icons/ai";
import { TbFileReport  } from "react-icons/tb";
import { LuCoins, LuFile } from "react-icons/lu";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { report } from "process";
import { useUser } from "@clerk/nextjs";
type Props = {};
const AEGIS_SERVER = "http://localhost:9898";
const AuditReport = (props: Props) => {
  const [contractAddress, setContractAddress] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [requestedreport, setRequestedReport] = React.useState<boolean | null>(null); //["Report requested"
  const [loading, setLoading] = React.useState<boolean>(false);
  const { user } = useUser();
  const user_id = user?.id;
  function shortenText(text: string) {
    if (text.length <= 250) {
      return text;
    } else {
      return text.slice(0, 250) + "...";
    }
  }
  React.useEffect(() => {
    async function requestReport() {
      const response = await axios.get(`${AEGIS_SERVER}/report/${contractAddress}/${user_id}`)
      if(response.data.success){
        if(response.data.data=="Report requested"){
          return;
        }else{
          setRequestedReport(false)
          window.open(response.data.data, '_blank');
          return
        }
      }
      return
    }
    if (requestedreport) {
      requestReport();
    }
    },[]
  )
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(contractAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    if(!user_id){
      setError("Please login to request report.");
      return;
    }

    const response = await axios.get(`${AEGIS_SERVER}/report/${contractAddress}/${user_id}`)
    if(response.status==200){
      console.log(response.data)
      setLoading(false);
      if(response.data=="Report requested"){
        setRequestedReport(true);
        return;
      }else{
        setLoading(false);
        window.open(response.data, '_blank');
        return
      }
      setContractAddress("");
    }
  };
  const originalAudit =
    "A comprehensive audit report that includes a detailed analysis of the code, a list of all the vulnerabilities found, and recommendations on how to fix them.";
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (error) {
        setError(null);
      }
  
      setContractAddress(event.target.value);
    };
  return (
    <div
      className="border border-[#737373] p-5 pt-6 rounded-lg"
      style={{
        overflow: "hidden",
        backdropFilter: "blur(30px)",
        boxShadow: "0px -10px 15px rgba(0, 0, 0, 0.1) inset",
        background: `linear-gradient(to top, #414141 0%, #000000 70%);`,
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-[#e3e1e1] w-fit flex items-center gap-3">
          <LuFile className="text-[#c5c5c5] text-[22px] ml-[2px]" />
          Audit Report
        </h1>
      </div>
      <div className="py-4">
        <p>{shortenText(originalAudit)}</p>
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <p className="font-[500] uppercase text-[12px] md:text-[22px] tracking-[5px] text-center">
          Request Full Audit report .
        </p>
        {/* <p className="font-[500] uppercase text-[12px] md:text-[22px] tracking-[5px] text-center">
          Unlock Full Audit Report with Premium.
        </p> */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center justify-center">
        <Input className="w-full"
            type="text"
            placeholder="Contract Address"
            value={contractAddress}
            onChange={handleInputChange}
            errorMessage={error || ""}
          />
        <button
          type="submit"
          className="flex gap-3 items-center border p-2 rounded-lg font-[400] text-[16px] md:text-[20px] uppercase"
          
          >
          <TbFileReport /> Request Report
        </button>
          </form>
      </div>
    </div>
  );
};

export default AuditReport;
