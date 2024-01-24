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

interface MonitorProps {
  settings: {
    active: boolean;
    address: boolean;
    honeypot: boolean;
    contracts: boolean;
  };
  setSettings: (settings: any) => void;
}

const Monitor = React.forwardRef(function MonitorComponent(
  props: MonitorProps,
  ref
) {
  const { settings, setSettings } = props;
  const terminalRef = useRef<{ clearOutput?: () => void }>({});

  const [lineData, setLineData] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // prettier-ignore
    const initialData = (
      <TerminalOutput key={'intro'}>
      <pre className='max-md:scale-75 max-md:translate-x-[-50px]'>
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
  
  token     [on|off]               toggle token detection
  address                          list address detection
  address   [on|off] [address]     toggle address detection
  honeypot  [on|off]               toggle honeypot detection

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
    if (terminalRef.current?.clearOutput) {
      terminalRef.current?.clearOutput();
    }
  };

  const updateLog = (data: any) => {
    console.log(data);
    // console.log('Updating data: ', data);
    // generate random string for key
    // const key = Math.random().toString(36).substring(7);
    data.forEach((d: any, index: number) => {
      console.log('Updating data: ', d);
      const key = Math.random().toString(36).substring(7);
      if (d.type === 'tx') {
        setLineData([
          <TerminalOutput key={key}>
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
          <TerminalOutput key={key}>
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
      <TerminalOutput key={command}>
        <pre className="text-zinc-300">~/aegis-wg $ {command}</pre>
      </TerminalOutput>,
    ];

    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'start':
        console.log('start command');

        if (!settings.active) {
          setSettings((settings: any) => ({
            ...settings,
            active: !settings.active,
          }));

          setLineData([
            ...commandInput,
            <TerminalOutput key={12}>
              <pre>Starting watchdog...</pre>
            </TerminalOutput>,
          ]);
        } else {
          setLineData([
            ...commandInput,
            <TerminalOutput key={13}>
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
            <TerminalOutput key={1}>
              <pre>Stopped watchdog.</pre>
            </TerminalOutput>,
          ]);
        } else {
          setLineData([
            ...commandInput,
            <TerminalOutput key={1}>
              <pre className="text-[#ff5151]">
                Error: Watchdog already stopped.
              </pre>
            </TerminalOutput>,
          ]);
        }
        break;
      case 'token':
        if (args[0] === 'on') {
          setSettings((settings: any) => ({
            ...settings,
            token: true,
          }));
          setLineData([
            ...commandInput,
            <TerminalOutput key={1}>Token monitoring turned on</TerminalOutput>,
          ]);
        } else if (args[0] === 'off') {
          setSettings((settings: any) => ({
            ...settings,
            token: false,
          }));
          setLineData([
            ...commandInput,
            <TerminalOutput key={1}>
              Token monitoring turned off
            </TerminalOutput>,
          ]);
        }
        break;
      case 'address':
        if (args[0] === undefined) {
          if (settings.address.length === 0) {
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>
                No address is being monitored
              </TerminalOutput>,
            ]);
          } else {
            setLineData(
              [
                ...commandInput,
                <TerminalOutput key={1}>
                  Address monitoring is turned on for
                </TerminalOutput>,
              ].concat(
                settings.address.map((addr, key) => (
                  <TerminalOutput key={2 + key}>{addr}</TerminalOutput>
                ))
              )
            );
          }
        } else if (args[0] === 'on') {
          if (args[1] === undefined) {
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>No address is specified</TerminalOutput>,
            ]);
          } else if (!/^(0x)?[0-9a-fA-F]{40}$/.test(args[1])) {
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>Invalid address</TerminalOutput>,
            ]);
          } else {
            if (!settings.address.includes(args[1].toLowerCase())) {
              setSettings((settings: any) => ({
                ...settings,
                address: settings.address.concat(args[1].toLowerCase()),
              }));
            }
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>
                Address monitoring for {args[1]} has been turned on
              </TerminalOutput>,
            ]);
          }
        } else if (args[0] === 'off') {
          if (args[1] === undefined) {
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>No address is specified</TerminalOutput>,
            ]);
          } else {
            setSettings((settings: any) => ({
              ...settings,
              address: settings.address.filter(addr => addr !== args[1]),
            }));
            setLineData([
              ...commandInput,
              <TerminalOutput key={1}>
                Address monitoring for {args[1]} has been turned off
              </TerminalOutput>,
            ]);
          }
        }
        break;
      case 'honeypot':
        setSettings((settings: any) => ({
          ...settings,
          honeypot: !settings.honeypot,
        }));
        setLineData([
          ...commandInput,
          <TerminalOutput key={1}>
            {'Honeypot monitoring turned ' + (settings.honeypot ? 'off' : 'on')}
          </TerminalOutput>,
        ]);
        break;
      case 'clear':
        handleClearOutput();
        return;
      default:
        if (input) {
          setLineData([
            ...commandInput,
            <TerminalOutput key={1}>Unrecognized command</TerminalOutput>,
          ]);
        }
    }

    // if (command !== 'clear') {
    //   ld.push(<TerminalInput>{input}</TerminalInput>);
    //   setLineData(ld);
    // }
  }

  return (
    <div className="md:pl-4 md:pr-4 max-md:w-screen md:max-w-[800px]">
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
