import { useState, useEffect } from 'react';
import axios from 'axios';

function useTokenInfo(tokenAddress: string, fetchMeta = false) {
  const [isFetching, setIsFetching] = useState(false);
  const [tokenRequestInfo, setTokenRequestInfo] = useState(null);
  const [tokenMetaData, setTokenMetaData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tokenAddress) return;

    setIsFetching(true);

    axios
      .get(`/api/token/info?address=${tokenAddress}&type=request`)
      .then(response => {
        console.log(response.data);
        setTokenRequestInfo(response.data);

        if (fetchMeta) {
          return axios.get(`/api/token/info?address=${tokenAddress}&type=meta`);
        }
      })
      .then(response => {
        if (response) {
          setTokenMetaData(response.data);
        }
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [tokenAddress, fetchMeta]);

  return { isFetching, tokenRequestInfo, tokenMetaData, error };
}

export default useTokenInfo;
