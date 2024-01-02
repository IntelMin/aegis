"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useSendTransaction } from "wagmi";
import { ethers } from "ethers";
type Props = {
  params: {
    id: string;
  };
};

const PaymentRoute = ({ params }: Props) => {
  const { isConnected } = useAccount();
  const user = useSession();
  const contractAddress = params.id;
  const router = useRouter();
  const { isSuccess, sendTransaction } = useSendTransaction({
    to: "0x3a432Ee7bb50A2f9d66aD57c05473b73070a2085",
    value: ethers.parseUnits("0.001", 18),
    onSuccess: async () => {
      console.log("success");
      const addpayment = async () => {
        const payment = await fetch("/api/addpayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.data?.user?.email,
            token: contractAddress,
          }),
        });
        const paymentResponse = await payment.json();
        console.log(paymentResponse);
        if (paymentResponse.paiduser == true) {
          router.push(`/tokenaudit/${contractAddress}/detailed`);
        }
      };
      addpayment();
    },
  });
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
      if (paiduserResponse.paiduser === true) {
        router.push(`/tokenaudit/${contractAddress}/detailed`);
      }
    };
    ifpaiduser();
  }, [isSuccess]);
  return (
    <div className="tokenBg flex justify-center items-center h-screen-[110px]">
      <div className="flex flex-col gap-4 text-center bg-zinc-900 rounded p-6 rounded-xl opacity-90 pl-20 pr-20">
        <div className="flex flex-col items-left justify-left w-full">
          {isConnected ? (<ConnectButton />) : (<div></div> )}
        </div>
        <h1 className="text-2xl text-white text-semibold">Payment</h1>
        <h1 className="text-md text-neutral-300">
          Please pay to audit your token.
        </h1>
        <div className="flex flex-col items-center w-full h-full">
          {isConnected ? (
            <button
              className="bg-[#0E76FD] text-white text-sm px-28 py-2 space-y-4"
              onClick={() => sendTransaction()}
            >
              Pay 0.001 ETH
            </button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </div>
  );
};
export default PaymentRoute;
