"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import TreeView from "@/components/treeview";
import { Button, Card, Skeleton, Chip } from "@nextui-org/react";
import { toast } from "sonner";

type Props = {
  tree: any;
  code: any;
  findings: any;
};

const CodeViewer = (data: Props) => {
  const [contractCode, setContractCode] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractCode(event.target.value);
  };

  const [treeViewData, setTreeViewData] = useState<any>([]);
  const [sourceCode, setSourceCode] = useState<string>("");
  const [findings, setFindings] = useState<any>([]);

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (data.tree) {
      console.log(data.tree);
      setTreeViewData(data.tree);
      setSourceCode(data.code);
      setFindings(data.findings);
    }
  }, [data]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const goToLine = (lineNumber: number) => {
    const editor = editorRef.current;
    if (editor) {
      console.log("setting line: " + lineNumber);
      editor.revealLineInCenter(lineNumber);
      editor.setPosition({ lineNumber: lineNumber, column: 1 });
      editor.focus();
    }
  };

  const handleLineSelectClick = (line: any) => {
    console.log("Line number: " + line);
    goToLine(line);
  };

  const [visibleMitigation, setVisibleMitigation] = useState(null);

  const toggleMitigation = (index: React.SetStateAction<null>) => {
    setVisibleMitigation(visibleMitigation === index ? null : index);
  };

  return (
    <>
      <div className="flex h-screen bg-black">
        <div className="flex flex-col w-[20%]">
          <div className="p-4 text-white">
            <h1 className="font-bold text-md">Call Tree</h1>
          </div>
          <div className="flex-1 p-4 bg-[#141414]">
            <TreeView
              data={treeViewData}
              onLineSelect={handleLineSelectClick}
            />
          </div>
        </div>

        {/* <!-- Editor Container --> */}
        <div className="flex flex-col flex-1 w-[60%]">
          <div className="p-4 text-white">
            <h1 className="font-bold text-md">Contract code</h1>
          </div>
          {/* <!-- Editor Area --> */}
          <div className="flex-1 p-4 bg-[#141414]">
            <Editor
              height="calc(100%)"
              theme="vs-dark"
              defaultLanguage="solidity"
              defaultValue={sourceCode}
              onMount={handleEditorDidMount}
              options={{
                minimap: {
                  enabled: true,
                },
                fontSize: 12,
                cursorStyle: "block",
                wordWrap: "on",
                language: "solidity",
              }}
            />
          </div>
        </div>

        {/* <!-- Findings and Reports Container --> */}
        <div className="flex flex-col w-[20%]">
          {/* <!-- Findings Area --> */}
          <div className="flex flex-col flex-1 p-4">
            {/* <!-- Header for Findings --> */}
            <div className="mb-4 text-white">
              <h1 className="font-bold text-md">Findings</h1>
            </div>
            {/* <!-- Placeholder for Findings Content --> */}
            <div className="flex-1 h-screen overflow-y-auto">
              {findings.map((item: any, index: any) => (
                <div
                  key={index}
                  className="max-w-sm mx-auto overflow-hidden rounded-lg shadow-md bg-[#141414] cursor-pointer mb-4"
                  onClick={() => toggleMitigation(index)}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <Chip
                        variant="dot"
                        color={item.severity == "MEDIUM" ? "warning" : "danger"}
                        className="text-sm font-bold uppercase"
                      >
                        {item.severity}
                      </Chip>
                    </div>
                    <p className="mt-4 text-xs font-bold text-gray-300">
                      {item.title}
                    </p>
                    {visibleMitigation === index && (
                      <div className="mt-4 text-sm text-gray-400">
                        {item.mitigation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeViewer;
