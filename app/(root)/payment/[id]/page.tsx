"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSendTransaction } from "wagmi";
import { ethers } from "ethers";
type Props = {
  params: {
    id: string;
  };
};

const PaymentRoute = ({ params }: Props) => {

    const user = useSession()
    const contractAddress = params.id;
    const router = useRouter();
    const {isSuccess, sendTransaction} = useSendTransaction({
      to: process.env.AEGIS_WALLET,
      value: ethers.parseUnits("0.1", "18")
    })

    useEffect(() => {
        const ifpaiduser = async () => {
            const paiduser = await fetch("/api/paiduser", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.data?.user?.email,
                token: contractAddress,
              }),
            });
            const paiduserResponse = await paiduser.json();
            console.log(paiduserResponse);
            if (paiduserResponse.paiduser === true) {
              router.push(`tokenaudit/${contractAddress}/detailed}`);
            }
          };
          ifpaiduser(); 
    }, [isSuccess]);
  return (
<div className="flex flex-col items-left justify-left w-full h-full">
    <ConnectButton />
    <h1 className="text-2xl text-white text-semibold">Payment</h1>
    <h1 className="text-md text-neutral-300">Please pay to audit your token.</h1>
    <div className="flex flex-col items-left justify-left w-full h-full">
      <button className="bg-[#0E76FD] text-white text-sm px-28 py-2 space-y-4" onClick={()=>sendTransaction()}>Pay with Metamask</button>
      </div>
    </div>
      );
}
export default PaymentRoute;