import React from 'react';

const TerminalOutput = ({ children }: { children?: React.ReactNode }) => {
  return <div className="react-terminal-line">{children}</div>;
};

export default TerminalOutput;
