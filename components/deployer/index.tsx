"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Input, Button } from "@nextui-org/react";
import { BsFillSendFill } from "react-icons/bs";

const editorOptions = {
  minimap: {
    enabled: true,
  },
  fontSize: 14,
  cursorStyle: "block",
  wordWrap: "on",
}

const Deployer = () => {
  return (
    <div className="grid grid-rows-1 grid-cols-[1fr,auto] gap-4 h-full">
      <div className="grid grid-rows-[1fr,auto] gap-4">
        <Editor
          width="99%"
          theme="vs-dark"
          language="solidity"
          defaultLanguage="javascript"
          defaultValue=""
          options={editorOptions}
        />
        <div className="grid grid-rows-[1fr,auto] h-64 p-2 gap-2 rounded-md bg-zinc-700">
          <div></div>
          <Input
            size="sm"
            endContent={
              <Button color="primary" variant="light" size="sm" isIconOnly>
                <BsFillSendFill />
              </Button>  
            }
          />
        </div>
      </div>
      <div className="grid grid-rows-[1fr,auto] gap-4">
        <div className="p-4 rounded-md bg-zinc-700">s</div>
        <Button className="w-64">Deploy</Button>
      </div>
    </div>
  )
}

export default Deployer
