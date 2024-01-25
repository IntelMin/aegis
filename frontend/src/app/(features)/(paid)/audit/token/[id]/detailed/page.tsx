'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { AUDIT_STATUS_RETURN_CODE } from '@/utils/audit-statuses';
import usePaidUser from '@/hooks/usePaiduser';
import dynamic from 'next/dynamic';
import GridLoader from 'react-spinners/GridLoader';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';

const AuditOverview = dynamic(
  () => import('@/components/audit/detail/overview'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

const FunctionReport = dynamic(
  () => import('@/components/audit/detail/function-report'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

// const OverViewReport = dynamic(
//   () => import('@/components/audit/detail/overview-report'),
//   {
//     loading: () => <GridLoader color="white" />,
//   }
// );

const CodeEditor = dynamic(() => import('@/components/audit/code-editor'), {
  loading: () => <GridLoader color="white" />,
});

const InheritanceGraph = dynamic(
  () => import('@/components/audit/detail/inheritance-graph'),
  {
    loading: () => <GridLoader color="white" />,
  }
);

type Props = {
  params: {
    id: string;
  };
  paidUser: boolean;
};

type Finding = {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  mitigation: string;
};

export type DataProps = {
  key: number;
  type: string | null;
  name: string | null;
  mutating: string | null;
  spec: string | null;
};

type ProjectData = {
  name: string;
  symbol: string;
  address: string;
  circulating_market_cap: string;
  decimals: string;
  exchange_rate: string;
  holders: string;
  icon_url: string;
  total_supply: string;
  type: string;
};

type CodeData = {
  status?: number;
  tree?: string[] | null;
  code: string | null;
  findings: Finding[] | null;
};

const getStatusText = (statusCode: number) => {
  switch (statusCode) {
    case AUDIT_STATUS_RETURN_CODE.notRequested:
      return 'REQUESTING';
    case AUDIT_STATUS_RETURN_CODE.pending:
      return 'PROCESSING';
    case AUDIT_STATUS_RETURN_CODE.partial:
      return 'PROCESSING';
    case AUDIT_STATUS_RETURN_CODE.complete:
      return 'COMPLETE';
    case AUDIT_STATUS_RETURN_CODE.errorFetchingDb:
    default:
      return 'An error occurred, please try again later or contact support';
  }
};

const getProgressMessage = (progress: number) => {
  if (progress < 20) {
    return 'Initializing audit protocols...';
  } else if (progress < 40) {
    return 'Analyzing contract structures...';
  } else if (progress < 60) {
    return 'Examining smart contract dependencies...';
  } else if (progress < 80) {
    return 'Performing security checks and optimizations...';
  } else if (progress < 100) {
    return 'Finalizing audit and compiling report...';
  } else {
    return 'Audit complete!';
  }
};

const DetailedPage = ({ params, paidUser }: Props) => {
  const router = useRouter();
  const tabArr = ['Overview', 'Code', 'Functions', 'Dependency'];
  const contractAddress = params.id;
  const [tab, setTab] = useState('Overview');

  const [infoData, setInfoData] = useState<ProjectData | null>(null);
  const [metaData, setMetaData] = useState<any | null>(null);
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [functionTableData, setFunctionTableData] = useState<
    DataProps[] | null
  >(null);
  const [dependencyData, setDependencyData] = useState<any>([null]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(AUDIT_STATUS_RETURN_CODE.notRequested);
  const [statusProgress, setStatusProgress] = useState(0);
  const [statusEta, setStatusEta] = useState<number | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const paiduser = usePaidUser(contractAddress);

  useEffect(() => {
    console.log({ paiduser });
    if (paiduser == false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please pay to audit this token',
      });
      router.push(`/audit/token/${params.id}`);
      return;
    }
  }, [paiduser, contractAddress]);

  const getAuditResults = async () => {
    try {
      const fetchData = async () => {
        try {
          const response = await fetch('/api/audit/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'audit', address: contractAddress }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();

          console.log(responseData);

          // setFunctionTableData(responseData.findings?.table?.slice(1));
          setInfoData(responseData);
          setMetaData(responseData.metadata);
          setCodeData(responseData.code);
          setFunctionTableData(responseData.functions.tableRows);
          setDependencyData(responseData.dependencies);

          // if (codeData.status === AUDIT_STATUS_RETURN_CODE.complete) {
          //   if (timer.current) clearInterval(timer.current);
          // }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } catch (error) {
      console.error('Error polling data:', error);
    }
  };

  const requestAudit = async () => {
    try {
      const response = await fetch('/api/audit/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audit_request',
          address: contractAddress,
        }),
      });
      // check if response is 200
      if (!response.ok) {
        console.error('Error requesting audit:', response);
        if (timer.current) clearInterval(timer.current);
      }
    } catch (error) {
      console.error('Error requesting audit:', error);
    }
  };

  const pollStatus = async () => {
    if (timer.current) clearInterval(timer.current);

    try {
      const response = await fetch('/api/audit/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audit_status',
          address: contractAddress,
        }),
      });
      const auditData = await response.json();
      console.log({ auditData });

      setStatus(auditData.status);
      switch (auditData.status) {
        case AUDIT_STATUS_RETURN_CODE.notRequested:
          requestAudit();
        // Fall through to start polling
        case AUDIT_STATUS_RETURN_CODE.pending:
        case AUDIT_STATUS_RETURN_CODE.partial:
          setStatus(auditData.status);
          setStatusProgress(auditData.progress);

          if (statusEta === null) {
            setStatusEta(auditData.eta);
          }

          timer.current = setInterval(pollStatus, 5000);
          break;
        case AUDIT_STATUS_RETURN_CODE.complete:
          if (timer.current) clearInterval(timer.current);
          getAuditResults();
          break;
      }
    } catch (error) {
      console.error('Error polling data:', error);
      setStatus(4);
    }
  };

  useEffect(() => {
    if (!paiduser) {
      return;
    }
    if (contractAddress) {
      pollStatus();
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [contractAddress, paiduser]);

  if (!paiduser) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-white">
        <div className="text-lg font-bold text-center">
          <Loader />
        </div>
      </div>
    );
  }
  if (loading) {
    const progressMessage = getProgressMessage(statusProgress);
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-white">
        <div className="text-lg font-bold text-center w-[200px] mb-10">
          <p className="mb-5 text-gray-200 animate-pulse">Loading...</p>
          <Progress value={statusProgress} />
        </div>
        <div className="text-lg font-bold text-center">
          <p className="mt-2">{progressMessage}</p>
          <p className="mt-2 text-xs text-gray-400">
            {getStatusText(status)}
            {getStatusText(status) === 'PROCESSING' && (
              <span>
                {statusEta !== null && statusEta > 0
                  ? ` (${Math.floor(statusEta / 60)} ${
                      Math.floor(statusEta / 60) === 1 ? 'minute' : 'minutes'
                    } reminaing)`
                  : 'Calculating ETA...'}
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  const renderComponent = () => {
    switch (tab) {
      case 'Overview':
        // return <OverViewReport data={infoData} token={params.id} />;
        return (
          <div className="p-6">
            <AuditOverview address={contractAddress} token={infoData} />
          </div>
        );
      case 'Code':
        return (
          // border border-zinc-800
          <CodeEditor
            source={codeData?.code ?? ''}
            findings={codeData?.findings}
            tree={codeData?.tree}
          />
        );
      case 'Functions':
        return <FunctionReport data={functionTableData} />;
      case 'Dependency':
        return (
          <div>
            <InheritanceGraph data={dependencyData} />
          </div>
        );
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col w-full text-white">
      <div className="bg-[url(/backgrounds/audit-banner.svg)] bg-cover flex justify-center items-center w-full h-[240px] relative">
        {/* Token Name */}
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center gap-3">
            <Image
              src={
                metaData.imageSmallUrl
                  ? `/api/token/image?q=${metaData.imageSmallUrl
                      .split('/')
                      .pop()}`
                  : `/icons/token-default.svg`
              }
              alt="token-icon"
              width={40}
              height={40}
            />
            <h3 className="text-neutral-50 text-[32px]">{metaData?.name}</h3>
            <p className="text-neutral-300 text-[24px] font-[300]">
              {metaData?.symbol}
            </p>
          </div>
          <p className="text-blue-400 text-[16px] font-[300] md:px-4 py-2">
            {params?.id}
          </p>
        </div>
        {/* Tabs */}
        <div className="max-md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-12">
          {tabArr?.map(item => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`${
                tab === item
                  ? 'text-neutral-50 border-b-[4px] border-blue-600'
                  : 'text-neutral-500 border-b-[4px] border-transparent'
              } text-[18px] transition-all ease-in duration-150 px-1 py-2`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="hidden max-md:grid grid-cols-2 items-center justify-center gap-5 p-4">
        {tabArr?.map(item => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`${
              tab === item
                ? 'text-neutral-50 border-b-[4px] border-blue-600 bg-zinc-900'
                : 'text-neutral-500 border-b-[4px] border-transparent'
            } col-span-1 text-[18px] transition-all ease-in duration-150 px-1 py-2`}
          >
            {item}
          </button>
        ))}
      </div>
      {renderComponent()}
    </div>
  );
};

export default DetailedPage;
