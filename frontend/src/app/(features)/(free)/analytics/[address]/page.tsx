'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import useTokenInfo from '@/hooks/useTokenInfo';

import TokenAuditHead from '@/components/analytics/header';

type Props = {
  params: {
    address: string;
  };
};

const Analytics = ({ params }: Props) => {
  const { toast } = useToast();
  const contractAddress = params.address;
  const [liveData, setLiveData] = useState<any>(null);
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const { isFetching, tokenMetaData, error } = useTokenInfo(
    contractAddress,
    true
  );

  return <></>;
};

export default Analytics;
