"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Input, Button } from "@nextui-org/react";
import { BsFillSendFill } from "react-icons/bs";
import axios from "axios";

const { AEGIS_SRV } = process.env;

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
  const [code, setCode] = useState('');
  const [status, setStatus] = useState();
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    axios.get(`http://${AEGIS_SRV}/deployer/code`)
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault()

    axios.post(`http://${AEGIS_SRV}/deployer/update-code`, { prompt, code })
      .then(response => {
        setCode(response.data.code);
        setStatus(response.data.status);
      });
  }, [prompt, code])

  return (
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
          <div></div>
          <form onSubmit={handleSubmit}>
            <Input
              size="sm"
              value={prompt}
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
          {JSON.stringify(status)}
        </div>
        <Button className="w-64">Deploy</Button>
      </div>
    </div>
  )
}

export default Deployer
