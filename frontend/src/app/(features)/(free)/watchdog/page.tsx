'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Monitor from '@/components/watchdog/monitor';
import BlockStatus from '@/components/watchdog/status';
import { io, Socket } from 'socket.io-client';

interface WatchdogProps {}

const Watchdog: FC<WatchdogProps> = ({}) => {
  const websocket_url = 'ws://localhost:4444';
  const statusRef = useRef<{ updateBlock?: (data: any) => void }>({});
  const monitorRef = useRef<{ updateLog?: (data: any) => void }>({});
  const [settings, setSettings] = useState({
    active: false,
    address: true,
    honeypot: true,
    contracts: true,
  });
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (settings.active) {
      // Establish connection with socket.io server
      setSocket(io(websocket_url));

      if (socket) {
        socket.on('connect', () => {
          console.log('Connected to the server!');
        });

        // Handle disconnection
        socket.on('disconnect', () => {
          console.log('Disconnected from the server');
        });

        // Handle block status updates
        socket.on('block_status', data => {
          if (statusRef.current?.updateBlock) {
            statusRef.current.updateBlock(data);
          }
          console.log('Received block from socket');
        });

        // Handle log updates
        socket.on('log', data => {
          if (monitorRef.current?.updateLog) {
            monitorRef.current.updateLog(data);
          }
          console.log('Received log from socket');
        });
      }
    } else {
      // Disconnect if the socket is established
      if (socket) {
        socket.disconnect();
      }
    }

    // Clean up the connection when component unmounts or active status changes
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [settings.active]);

  return (
    <div className="h-full w-full ">
      <div className="justify-center items-center w-full">
        <div className="p-4 text-center">
          <h1 className="text-lg text-zinc-500 mix-blend-difference">
            Live{' '}
            <span
              style={{
                outline: 'none',
                background: 'url(/backgrounds/scanner.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
              className="text-transparent font-bold text-zinc-200"
            >
              Watchdog
            </span>
          </h1>
        </div>
      </div>
      <div className={`flex justify-center items-stretch p-4`}>
        <div className="flex flex-none w-1/6 border border-zinc-800">
          <BlockStatus ref={statusRef} settings={settings} />
        </div>

        <div className="flex-grow w-1/2">
          <Monitor
            ref={monitorRef}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        <div className="flex flex-none w-1/4 border border-zinc-800">
          Anomalies...
        </div>
      </div>
    </div>
  );
};

export default Watchdog;
