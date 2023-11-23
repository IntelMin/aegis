"use client";

import React, { useState,useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Input, Button } from "@nextui-org/react";
import { BsFillSendFill } from "react-icons/bs";
import axios from "axios";
const editorOptions = {
  minimap: {
    enabled: true,
  },
  readonly:true,
  fontSize: 14,
  cursorStyle: "block",
  wordWrap: "on",
}

const Deployer = () => {
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({});
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    axios.get('/deployer/code')
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });
  }, []);
  const handleSend = () => {
    axios.post('/deployer/update-code', { prompt })
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });
  };

  const handleKeyPress = (event:any) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };
  const handleDeploy = async () => {
    try {
      const response = await axios.post('/deployer/deploy');
      setAddress(response.data.address)
      // setModalContent(`Contract deployed at address: ${response.data.address}`);
      // setIsModalOpen(true);
    } catch (error) {
      // setModalContent('Failed to deploy contract');
      // setIsModalOpen(true);
    }
  };
  return (
    <div className="grid grid-rows-1 grid-cols-[1fr,auto] gap-4 h-full">
      <div className="grid grid-rows-[1fr,auto] gap-4">
        <Editor
          width="99%"
          theme="vs-dark"
          language="solidity"
          defaultLanguage="javascript"
          defaultValue=""
          code = {code}
          options={editorOptions}
        />
        <div className="grid grid-rows-[1fr,auto] h-64 p-2 gap-2 rounded-md bg-zinc-700">
          <div></div>
          <Input
            size="sm"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            endContent={
              <Button color="primary" variant="light" size="sm" isIconOnly onClick={handleSend}>
                <BsFillSendFill />
              </Button>  
            }
          />
        </div>
      </div>
      <div className="grid grid-rows-[1fr,auto] gap-4">
        <div className="p-4 rounded-md bg-zinc-700">s</div>
        <Button className="w-64" onClick={handleDeploy} >Deploy</Button>
      </div>
    </div>
  )
}

export default Deployer
