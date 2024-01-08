import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';

import { Skeleton } from '@/components/ui/skeleton';

interface TradingViewChartProps {
  chain: string;
  pair: string;
}

function TradingViewChart({ pair, chain }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(true);

  const generateCandlestickData = (startDate: string, count: number) => {
    const data = [];
    let date = new Date(startDate);
    let previousClose = Math.random() * 100 + 100;

    for (let i = 0; i < count; i++) {
      const open = previousClose;
      const close = open + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;

      data.push({
        time: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
      });

      previousClose = close;
      date.setDate(date.getDate() + 1);
    }
    return data;
  };

  const candlestickData = generateCandlestickData('2018-12-22', 100);

  useEffect(() => {
    if (chartContainerRef.current && chartRef.current === null) {
      const newChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: '#000000' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: {
            color: '#191919',
          },
          horzLines: {
            color: '#191919',
          },
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 0.8)',
        },
      });

      const candleSeries = newChart.addCandlestickSeries({
        upColor: 'rgb(38,166,154)',
        downColor: 'rgb(255,82,82)',
        borderVisible: false,
        wickUpColor: 'rgb(38,166,154)',
        wickDownColor: 'rgb(255,82,82)',
      });
      candleSeries.setData(candlestickData);

      chartRef.current = newChart;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [candlestickData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    //This is skeleton loading state will add when api is ready.
    setLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex gap-3 text-white">
        <span>{pair}</span>
        <span className="text-gray-500">{chain}</span>
      </div>
      {loading ? (
        <Skeleton className="w-full h-[500px]" />
      ) : (
        <div
          ref={chartContainerRef}
          style={{ position: 'relative', width: '100%' }}
        />
      )}
    </>
  );
}

export default TradingViewChart;
