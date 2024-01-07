'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Editor from '@monaco-editor/react';
import TreeView from '@/components/audit/code-editor/treeview';

type Props = {
  setContractCode?: (code: string) => void;
  source: string | null;
  findings: any | null;
  tree: any | null;
  readonly?: boolean;
};

const CodeAuditEditor = (props: Props) => {
  const [treeViewData, setTreeViewData] = useState<any>([]);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [findings, setFindings] = useState<any>([]);
  const isReadOnly = props.readonly !== undefined ? props.readonly : true;

  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (props?.tree) {
      setTreeViewData(props?.tree);
    }

    if (props?.source) {
      console.log('--- source');
      console.log(props?.source);
      setSourceCode(props?.source);
    }

    if (props?.findings) {
      setFindings(props?.findings);
    }
  }, [props]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.setContractCode && !isReadOnly) {
      props.setContractCode(event.target.value);
    }
  };

  const goToLine = (lineNumber: number) => {
    const editor = editorRef.current;
    if (editor) {
      console.log('setting line: ' + lineNumber);
      editor.revealLineInCenter(lineNumber);
      editor.setPosition({ lineNumber: lineNumber, column: 1 });
      editor.focus();
    }
  };

  const handleLineSelectClick = (line: number) => {
    goToLine(line);
  };

  const [visibleMitigation, setVisibleMitigation] = useState(null);

  const toggleMitigation = (index: React.SetStateAction<null>) => {
    setVisibleMitigation(visibleMitigation === index ? null : index);
  };

  return (
    <>
      <div className="flex justify-center w-full h-screen bg-transparent">
        {isReadOnly && (
          <div className="flex flex-col w-[20%]">
            <div className="p-4 text-sm text-white">
              <h1 className="font-bold text-md">Call Tree</h1>
            </div>
            <div className="flex-1 p-4 bg-[#141414] h-screen overflow-y-scroll">
              <TreeView
                data={treeViewData}
                onLineSelect={handleLineSelectClick}
              />
            </div>
          </div>
        )}
        {/* <!-- Editor Container --> */}
        <div className="flex flex-col min-h-[667px] w-[60%]">
          <div className="p-4 text-sm text-white">
            <h1 className="font-bold text-md">Contract</h1>
          </div>
          {/* <!-- Editor Area --> */}
          <div className="flex-1 bg-[#09090B] h-full overflow-y-scroll">
            <Editor
              height="calc(100%)"
              theme="vs-dark"
              language="sol"
              defaultLanguage="solidity"
              defaultValue=""
              value={sourceCode}
              onMount={handleEditorDidMount}
              options={{
                autoIndent: 'full',
                contextmenu: true,
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: 24,
                wordWrap: 'on',
                cursorStyle: 'block',
                hideCursorInOverviewRuler: true,
                matchBrackets: 'always',
                minimap: {
                  enabled: true,
                },
                scrollbar: {
                  horizontalSliderSize: 4,
                  verticalSliderSize: 18,
                },
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: isReadOnly,
                automaticLayout: true,
              }}
              onChange={
                !isReadOnly
                  ? (newValue: any) =>
                      props.setContractCode
                        ? props.setContractCode(newValue)
                        : ''
                  : undefined
              }
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 max-w-[300px]">
          {/* <!-- Header for Findings --> */}
          <div className="p-4 text-sm text-white">
            <h1 className="font-bold text-md">
              Findings{' '}
              {!isReadOnly && <span className="mt-1 animate-pulse">🟢</span>}
            </h1>
          </div>
          {/* <!-- Placeholder for Findings Content --> */}
          <div className="flex-1 h-full pr-5 space-y-6 overflow-y-scroll">
            {findings?.length > 0 ? (
              findings.map((finding: any, index: number) => (
                <div
                  key={index}
                  className="bg-zinc-900 min-h-[76px] ml-5 max-w-[300px] flex-cols items-center gap-3 space-y-6 text-white p-6"
                >
                  <button className="px-3 py-2 text-sm font-semibold text-white uppercase border-2 rounded-full border-zinc-600">
                    <b className="animate-pulse mx-0.5">
                      {finding.severity === 'INFO'
                        ? '🔵'
                        : finding.severity === 'MEDIUM'
                        ? '🟠'
                        : finding.severity === 'LOW'
                        ? '🟡'
                        : '🔴'}
                    </b>{' '}
                    {finding.severity}
                  </button>
                  <h1 className="font-semibold text-md">
                    {finding.vulnerability}
                  </h1>
                  <p className="text-xs">{finding.reason}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-800">
                <Image
                  src="/icons/findings-empty.svg"
                  width={120}
                  height={120}
                  alt="No findings"
                />
                <h1 className="text-sm text-white">No findings available</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeAuditEditor;
