import { useState, useEffect } from 'react';
import axios from 'axios';

const useLiveData = (address: string | null): any => {
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    if (address) {
      const fetchData = () => {
        axios
          .get(`/api/token/live/?address=${address}`)
          .then(response => {
            setLiveData(response.data);
          })
          .catch(error => {
            console.error('Error fetching live data:', error);
          });
      };

      fetchData();
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [address]);

  return liveData;
};

export default useLiveData;
