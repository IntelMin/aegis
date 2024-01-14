'use client';

import React, {
  useState,
  MouseEvent,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import Terminal, { TerminalInput, TerminalOutput } from './terminal';

const Monitor = React.forwardRef((props, ref) => {
  const { settings, setSettings } = props;
  const terminalRef = useRef(null);

  const [lineData, setLineData] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // prettier-ignore
    const initialData = (
      <TerminalOutput>
      <pre>
      {`
          _    _____ ____ ___ ____      / \__
         / \\  | ____/ ___|_ _/ ___|    (    @\___
        / _ \\ |  _|| |  _ | |\\___ \\    /         O
       / ___ \\| |__| |_| || | ___) |  /   (_____/
      /_/   \\_\\_____\\____|___|____/  /_____/   `}
      {'\n'}
      <span className="font-regular">{`           Welcome to AEGIS WATCHDOG v0.21`}</span>
      {'\n\n'}
      {`The following commands are supported:
  
  token     [on|off]      toggle token detection
  honeypot  [on|off]      toggle honeypot detection
  address   [on|off]      toggle address detection
  contract  [address]     monitor only the specified contract
  clear                   clear the terminal
  start                   start scanning
  stop                    stop scanning
  `}
      </pre>
    </TerminalOutput>
    );

    setLineData([initialData]);
  }, []);

  // setLineData([
  //   <TerminalOutput>
  //     <pre className="font-regular"> Welcome to AEGIS WATCHDOG v0.21</pre>
  //   </TerminalOutput>,
  // ]);

  // const addPeriodicData = () => {
  //   setLineData(ld => [
  //     <TerminalOutput key={ld.length}>
  //       <pre>Periodic Update at {new Date().toLocaleTimeString()}</pre>
  //     </TerminalOutput>,
  //   ]);
  // };

  // useEffect(() => {
  //   const interval = setInterval(addPeriodicData, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleClearOutput = () => {
    terminalRef.current?.clearOutput();
  };

  const updateLog = (data: any) => {
    // console.log('Updating data: ', data);
    data.forEach((d: any) => {
      console.log('Updating data: ', d);
      if (d.type === 'tx') {
        setLineData([
          <TerminalOutput>
            <pre>
              {d.data.hash}
              {'\n'}
              {'├── FROM    '}
              {d.data.from}
              {'\n'}
              {'│    └─ TO  '}
              {d.data.to}
              {'\n'}
              {'└── ACTION  '}
              {d.data.action}
            </pre>
          </TerminalOutput>,
        ]);
      } else {
        setLineData([
          <TerminalOutput>
            <pre>{d}</pre>
          </TerminalOutput>,
        ]);
      }
    });

    // setLineData([
    //   <TerminalOutput>
    //     <pre>{data}</pre>
    //   </TerminalOutput>,
    // ]);
  };

  useImperativeHandle(ref, () => ({
    updateLog,
  }));

  function onInput(input: string) {
    const command = input.toLocaleLowerCase().trim();
    // let ld = [...lineData];

    const commandInput = [
      <TerminalOutput>
        <pre className="text-zinc-300">~/aegis-wg $ {command}</pre>
      </TerminalOutput>,
    ];

    switch (command) {
      case 'start':
        console.log('start command');

        if (!settings.active) {
          setSettings((settings: any) => ({
            ...settings,
            active: !settings.active,
          }));

          setLineData([
            ...commandInput,
            <TerminalOutput>
              <pre>Starting watchdog...</pre>
            </TerminalOutput>,
          ]);
        } else {
          setLineData([
            ...commandInput,
            <TerminalOutput>
              <pre className="text-[#ff5151]">
                Error: Watchdog already running.
              </pre>
            </TerminalOutput>,
          ]);
        }
        break;
      case 'stop':
        if (settings.active) {
          setSettings((settings: any) => ({
            ...settings,
            active: !settings.active,
          }));

          setLineData([
            ...commandInput,
            <TerminalOutput>
              <pre>Stopped watchdog.</pre>
            </TerminalOutput>,
          ]);
        } else {
          setLineData([
            ...commandInput,
            <TerminalOutput>
              <pre className="text-[#ff5151]">
                Error: Watchdog already stopped.
              </pre>
            </TerminalOutput>,
          ]);
        }
        break;
      case 'contracts':
        setSettings((settings: any) => ({
          ...settings,
          contracts: !settings.contracts,
        }));
        setLineData([
          ...commandInput,
          <TerminalOutput>
            {'Contracts monitoring turned ' +
              (settings.contracts ? 'off' : 'on')}
          </TerminalOutput>,
        ]);
        break;
      case 'address':
        setSettings((settings: any) => ({
          ...settings,
          address: !settings.address,
        }));
        setLineData([
          <TerminalOutput>
            {'Address monitoring turned ' + (settings.address ? 'off' : 'on')}
          </TerminalOutput>,
        ]);
        break;
      case 'honeypot':
        setSettings((settings: any) => ({
          ...settings,
          honeypot: !settings.honeypot,
        }));
        setLineData([
          <TerminalInput>
            {'Honeypot monitoring turned ' + (settings.honeypot ? 'off' : 'on')}
          </TerminalInput>,
        ]);
        break;
      case 'clear':
        handleClearOutput();
        return;
      default:
        if (input) {
          setLineData([
            ...commandInput,
            <TerminalOutput>Unrecognized command</TerminalOutput>,
          ]);
        }
    }

    // if (command !== 'clear') {
    //   ld.push(<TerminalInput>{input}</TerminalInput>);
    //   setLineData(ld);
    // }
  }

  return (
    <div className="pl-4 pr-4 max-w-[800px]">
      <Terminal
        ref={terminalRef}
        name="Watchdog Terminal"
        onInput={onInput}
        prompt="~/aegis-wg $"
      >
        {lineData}
      </Terminal>
    </div>
  );
});

export default Monitor;
