import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import GridLoader from 'react-spinners/GridLoader';

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

interface AuditDetailProps {
  contractAddress: string;
}

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

const AuditDetail: React.FC<AuditDetailProps> = ({ contractAddress }) => {
  const tabArr = ['Overview', 'Code', 'Functions', 'Dependency'];
  const [tab, setTab] = useState('Overview');
  const [infoData, setInfoData] = useState<ProjectData | null>(null);
  const [metaData, setMetaData] = useState<any | null>(null);
  const [codeData, setCodeData] = useState<CodeData | null>(null);
  const [functionTableData, setFunctionTableData] = useState<
    DataProps[] | null
  >(null);
  const [dependencyData, setDependencyData] = useState<any>([null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [contractAddress]);

  const renderComponent = () => {
    switch (tab) {
      case 'Overview':
        // return <OverViewReport data={infoData} token={params.id} />;
        return (
          <div className="p-6">
            <AuditOverview
              address={contractAddress}
              token={infoData}
              premium={true}
            />
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

  if (!loading) {
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
              {contractAddress}
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
  }
};

export default AuditDetail;
