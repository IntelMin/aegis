'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Monitor from '@/components/watchdog/monitor';
import BlockStatus from '@/components/watchdog/status';
import { io, Socket } from 'socket.io-client';
import { Sections } from '@/components/sections';

interface WatchdogProps {}

const Watchdog: FC<WatchdogProps> = ({}) => {
  const websocket_url = process.env.NEXT_PUBLIC_AEGIS_WSS;
  console.log('websocket_url', websocket_url);
  const statusRef = useRef<{ updateBlock?: (data: any) => void }>({});
  const monitorRef = useRef<{ updateLog?: (data: any) => void }>({});
  const [settings, setSettings] = useState({
    active: false,
    address: true,
    honeypot: true,
    contracts: true,
  });
  const [socket, setSocket] = useState<Socket>();
  const [showSection, setShowSection] = useState('monitor');
  const sectionsArr = [
    {
      name: 'Status',
      val: 'status',
    },
    {
      name: 'Monitor',
      val: 'monitor',
    },
    {
      name: 'Anomalies',
      val: 'anomalies',
    },
  ];

  useEffect(() => {
    let localSocket: Socket | null = null;

    if (settings.active) {
      localSocket = io(websocket_url || '');
      setSocket(localSocket);

      if (localSocket) {
        localSocket.on('connect', () => {
          console.log('Connected to the server!');
        });

        // Handle disconnection
        localSocket.on('disconnect', () => {
          console.log('Disconnected from the server');
        });

        // Handle block status updates
        localSocket.on('block_status', data => {
          if (statusRef.current?.updateBlock) {
            statusRef.current.updateBlock(data);
          }
          console.log('Received block from socket');
        });

        // Handle log updates
        localSocket.on('log', data => {
          console.log('log received');
          if (monitorRef.current?.updateLog) {
            console.log('trying...');
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
      <Sections
        sectionsArr={sectionsArr}
        setShowSection={setShowSection}
        showSection={showSection}
      />
      <div className="justify-center items-center w-full">
        <div className="p-4 text-center text-2xl">
          <h1 className="text-4xl text-zinc-500 mix-blend-difference">
            Live{' '}
            <span
              style={{
                outline: 'none',
                background: 'url(/backgrounds/watchdog.webp)',
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
        <div
          className={`${
            showSection === 'status' ? 'flex' : 'max-md:hidden'
          } flex-none w-full md:w-1/6 border border-zinc-800`}
        >
          <BlockStatus ref={statusRef} settings={settings} />
        </div>
        <div className="max-md:flex md:flex-grow max-md:overflow-x-scroll w-full md:w-1/2 monitor">
          <div
            className={`${
              showSection === 'monitor' ? 'flex-grow' : 'max-md:hidden'
            }`}
          >
            <Monitor
              ref={monitorRef}
              settings={settings}
              setSettings={setSettings}
            />
          </div>
        </div>

        <div
          className={`${
            showSection === 'anomalies' ? '' : 'max-md:hidden'
          } flex-none w-full md:w-1/4 border border-zinc-800 max-md:min-h-[500px] p-2 bg-zinc-900`}
        >
          <pre className="text-zinc-600">Anomalies...</pre>
        </div>
      </div>
    </div>
  );
};

export default Watchdog;
