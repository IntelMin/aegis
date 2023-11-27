"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Input, Button } from "@nextui-org/react";
import { BsFillSendFill } from "react-icons/bs";
import axios from "axios";
import { useAccount, useWalletClient } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Title from "@/components/title";
import config from '@/next.config'

const editorOptions = {
  minimap: {
    enabled: true,
  },
  readOnly: true,
  fontSize: 14,
  cursorStyle: "block" as "block" | "line" | "underline" | "line-thin" | "block-outline" | "underline-thin" | undefined,
  wordWrap: "on" as "on" | "off" | "wordWrapColumn" | "bounded" | undefined,
}

const Deployer = () => {
  const {isConnected}= useAccount()
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>()
  const [deployed, setDeployed] = useState<string>()
  const [deployError, setDeployError] = useState<string>()
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    axios.get(`http://${config.server}/deployer/code`)
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault()

    if (!prompt) {
      return
    }

    axios.post(`http://${config.server}/deployer/update-code`, { prompt, code })
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });

    setHistory(prev => prev.concat(prompt))
    setPrompt('')

    inputRef.current?.focus()
  }, [prompt, code])
  const { data: walletClient } = useWalletClient({ chainId: 11155111 }); // replace with your chainId

  const handleDeployClick = useCallback(async () => {
    try {
      const { data } = await axios.post(`http://${config.server}/deployer/compile`, { code:JSON.stringify(code) })
      const hash = await walletClient?.deployContract({
        abi: data.abi,
        bytecode: data.bytecode,
        args: [],
      });

      setDeploying(true)
      const tx = await waitForTransaction({ chainId: 11155111, hash: hash! })

      setDeployed(tx.to as string)
      setDeployError(undefined)
      setDeploying(false)
    } catch (e) {
      setDeployed(undefined)
      setDeployError(e instanceof Error ? e.shortMessage : JSON.stringify(e))
      setDeploying(false)
    }
  }, [code, walletClient])

  return (
    <>
      <Title
        title="Deployer"
        endContent={(
          <div className="flex items-center">
            <ConnectButton/>
            {deployed && (
              <p className='text-green-700 ml-2'>Deployed: {deployed}</p>
            )}
            {deployError && (
              <p className='text-red-700 ml-2'>{deployError}</p>
            )}
          </div>
        )}
      />
      <div className="grid grid-rows-1 grid-cols-[1fr,auto] gap-4 h-full">
        <div className="grid grid-rows-[1fr,auto] gap-4">
          <Editor
            width="99%"
            theme="vs-dark"
            language="solidity"
            defaultLanguage="javascript"
            defaultValue=""
            value={code}
            options={editorOptions}
          />
          <div className="grid grid-rows-[1fr,auto] h-64 p-2 gap-2 rounded-md bg-zinc-700">
            <div>
              
              {history.map((chat, key) => (
                <p key={key}>{chat}</p>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <Input
                size="sm"
                value={prompt}
                placeholder="Ask what you want to update"
                ref={ref => {
                  if (ref) {
                    ref.style.outline = 'none';
                    inputRef.current = ref
                  }
                }}
                onChange={e => setPrompt(e.target.value)}
                endContent={
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    isIconOnly
                    type="submit"
                  >
                    <BsFillSendFill />
                  </Button>  
                }
              />
            </form>
          </div>
        </div>
        <div className="grid grid-rows-[1fr,auto] gap-4">
          <div className="p-4 rounded-md bg-zinc-700">

            {Object.keys(status).map(key => (
              <div key={key} className="mb-4">
                <p className="text-gray-500">{key}</p>
                <p className="text-white">{status[key]}</p>
              </div>
            ))}
          </div>
          {isConnected?(
            <Button className="w-64" onClick={handleDeployClick} isLoading={deploying}>
              Deploy
            </Button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
    </>
  )
}

export default Deployer
