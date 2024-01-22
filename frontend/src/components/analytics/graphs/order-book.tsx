import React, { useEffect, useState } from 'react';
import qs from 'qs';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Skeleton } from '@/components/ui/skeleton';

function formatSubscript(value: number) {
  if (value == null) return null;

  console.log('yaxis USD value', value);

  let valueStr = value.toFixed(20);
  const match = valueStr.match(/0\.(0*)[1-9]/);
  if (match && match[1]) {
    const numberOfZeros = match[1].length;
    const nonZeroPart = valueStr.substring(
      valueStr.indexOf(match[1]) + numberOfZeros
    );
    return `0.0<sub>${numberOfZeros}</sub>${nonZeroPart}`;
  }
  return value.toFixed(2);
}

interface Book {
  bids: { p0: number; qty: number }[];
  asks: { p0: number; qty: number }[];
  price: number;
}

interface SeriesData {
  books: Book[];
}

const OrderBookGraph: React.FC<{
  pair: string;
  exchange: string;
  labels?: string[];
  priceUsd: number;
}> = ({ pair, exchange, labels, priceUsd }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const processSeriesData = (data: SeriesData) => {
    const bids = data.books
      .flatMap((book: { bids: any }) => book.bids)
      .sort((a: { p0: number }, b: { p0: number }) => b.p0 - a.p0)
      .reduce((acc: any[][], bid: { p0: any; qty: any }) => {

        const lastQty = acc.length > 0 ? acc[acc.length - 1][1] : 0;
        acc.push([bid.p0, bid.qty + lastQty]);
        return acc;
      }, []);

    const asks = data.books
      .flatMap((book: { asks: any }) => book.asks)
      .sort((a: { p0: number }, b: { p0: number }) => a.p0 - b.p0)
      .reduce((acc: any[][], ask: { p0: any; qty: any }) => {
        const lastQty = acc.length > 0 ? acc[acc.length - 1][1] : 0;
        acc.push([ask.p0, ask.qty + lastQty]);
        return acc;
      }, []);

    bids.reverse();

    const price = data.books[0].price;

    return { bids, asks, price };
  };

  useEffect(() => {
    setLoading(true);

    let pool = exchange;
    if (labels && labels.length > 0) {
      pool += `-${labels[0]}`;
    }

    const loadData = async () => {
      const queryString = qs.stringify({
        type: 'orders',
        address: pair,
        exchange: pool,
      });
      const response = await axios.get(`/api/analytics?${queryString}`);
      //   console.log('response', response);

      const { bids, asks, price } = processSeriesData(response.data);

      setData({
        chart: {
          type: 'area',
          zoomType: 'xy',
          height: '320px',
          backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        title: {
          text: null,
        },
        xAxis: {
          minPadding: 0,
          maxPadding: 0,
          plotLines: [
            {
              color: '#333',
              value: price,
              width: 1,
              dashStyle: 'dash',
              label: {
                text: 'Actual price',
                rotation: 90,
              },
            },
          ],
          labels: {
            formatter: function (this: { value?: number | null }) {
              console.log(`xAxis formatter`, this.value);
              if (this.value != null) {
                let formattedValue = parseFloat(this.value.toFixed(2));
                formattedValue = parseFloat(
                  (formattedValue * priceUsd).toFixed(2)
                );
                const formattedString = formatSubscript(formattedValue);
                return '$ ' + formattedString;
              }
              return null;
            },
            style: {
              fontSize: '14px',
              fontWeight: 400,
              color: '#D4D4D4',
            },
          },

          title: {
            text: null,
          },
          tickWidth: 0,
          minorTickLength: 0,
        },
        yAxis: [
          {
            lineWidth: 0,
            gridLineWidth: 0,
            title: null,
            tickWidth: 0,
            minorTickLength: 0,
            tickLength: 0,
            tickPosition: 'inside',
            labels: {
              align: 'left',
              x: 8,
              enabled: false,
              formatter: function (this: { value?: number | null }) {
                console.log(`yAxis formatter`, this.value);
                if (this.value != null) {
                  let formattedValue = parseFloat(this.value.toFixed(2));
                  formattedValue = parseFloat(
                    (formattedValue * priceUsd).toFixed(2)
                  );
                  const formattedString = formatSubscript(formattedValue);
                  return '$ ' + formattedString;
                }
                return null;
              },
              style: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#000',
              },
            },
          },
          {
            opposite: true,
            linkedTo: 0,
            lineWidth: 0,
            gridLineWidth: 0,
            title: null,
            tickWidth: 0,
            minorTickLength: 0,
            tickLength: 5,
            tickPosition: 'inside',
            labels: {
              align: 'right',
              x: 8,
              style: {
                fontSize: '12px',
                fontWeight: 400,
                color: '#D4D4D4',
              },
            },
          },
        ],
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillOpacity: 0.2,
            lineWidth: 1,
            step: 'center',
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size=10px;">Price: {point.key}</span><br/>',
          valueDecimals: 2,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: 'Bids',
            data: bids,
            color: '#03a7a8',
          },
          {
            name: 'Asks',
            data: asks,
            color: '#fc5857',
          },
        ],
      });
      setLoading(false);
    };

    loadData();
  }, [pair]);

  if (isLoading) {
    return (
      <Skeleton className="w-[100%] h-[320px] aspect-landscape translate-y-12" />
    );
  }

  // const options = {
  //   chart: {
  //     type: 'area',
  //     zoomType: 'xy',
  //     height: '320px',
  //     backgroundColor: 'rgba(0, 0, 0, 0)',
  //   },
  //   title: {
  //     text: null,
  //   },
  //   xAxis: {
  //     minPadding: 0,
  //     maxPadding: 0,
  //     plotLines: [
  //       {
  //         color: '#333',
  //         value: 0.1523,
  //         width: 1,
  //         dashStyle: 'dash',
  //         label: {
  //           text: 'Actual price',
  //           rotation: 90,
  //         },
  //       },
  //     ],
  //     labels: {
  //       formatter: function (this: { value?: number | null }) {
  //         if (this.value != null) {
  //           return '$ ' + this.value.toFixed(2); // Format labels as currency numbers
  //         }
  //         return null; // Return null if value is undefined or null
  //       },
  //       style: {
  //         fontSize: '14px',
  //         fontWeight: 400,
  //         color: '#D4D4D4', // Set the font color
  //       },
  //     },

  //     title: {
  //       text: null,
  //     },
  //     tickWidth: 0,
  //     minorTickLength: 0,
  //   },
  //   yAxis: [
  //     {
  //       lineWidth: 0,
  //       gridLineWidth: 0,
  //       title: null,
  //       tickWidth: 0,
  //       minorTickLength: 0,
  //       tickLength: 0,
  //       tickPosition: 'inside',
  //       labels: {
  //         align: 'left',
  //         x: 8,
  //         enabled: false,
  //         style: {
  //           fontSize: '12px',
  //           fontWeight: 400,
  //           color: '#000', // Set the font color
  //         },
  //       },
  //     },
  //     {
  //       opposite: true,
  //       linkedTo: 0,
  //       lineWidth: 0,
  //       gridLineWidth: 0,
  //       title: null,
  //       tickWidth: 0,
  //       minorTickLength: 0,
  //       tickLength: 5,
  //       tickPosition: 'inside',
  //       labels: {
  //         align: 'right',
  //         x: 8,
  //         style: {
  //           fontSize: '12px',
  //           fontWeight: 400,
  //           color: '#D4D4D4', // Set the font color
  //         },
  //       },
  //     },
  //   ],
  //   legend: {
  //     enabled: false,
  //   },
  //   plotOptions: {
  //     area: {
  //       fillOpacity: 0.2,
  //       lineWidth: 1,
  //       step: 'center',
  //     },
  //   },
  //   tooltip: {
  //     headerFormat:
  //       '<span style="font-size=10px;">Price: {point.key}</span><br/>',
  //     valueDecimals: 2,
  //   },
  //   credits: {
  //     enabled: false,
  //   },
  //   series: [
  //     {
  //       name: 'Bids',
  //       data: [
  //         [0.1524, 0.948665],
  //         [0.1539, 35.510715],
  //         [0.154, 39.883437],
  //         [0.1541, 40.499661],
  //         [0.1545, 43.262994000000006],
  //         [0.1547, 60.14799400000001],
  //         [0.1553, 60.30799400000001],
  //         [0.1558, 60.55018100000001],
  //         [0.1564, 68.381696],
  //         [0.1567, 69.46518400000001],
  //         [0.1569, 69.621464],
  //         [0.157, 70.398015],
  //         [0.1574, 70.400197],
  //         [0.1575, 73.199217],
  //         [0.158, 77.700017],
  //         [0.1583, 79.449017],
  //         [0.1588, 79.584064],
  //         [0.159, 80.584064],
  //         [0.16, 81.58156],
  //         [0.1608, 83.38156],
  //       ],
  //       color: '#03a7a8',
  //     },
  //     {
  //       name: 'Asks',
  //       data: [
  //         [0.1435, 242.521842],
  //         [0.1436, 206.49862099999999],
  //         [0.1437, 205.823735],
  //         [0.1438, 197.33275],
  //         [0.1439, 153.677454],
  //         [0.144, 146.007722],
  //         [0.1442, 82.55212900000001],
  //         [0.1443, 59.152814000000006],
  //         [0.1444, 57.942260000000005],
  //         [0.1445, 57.483850000000004],
  //         [0.1446, 52.39210800000001],
  //         [0.1447, 51.867208000000005],
  //         [0.1448, 44.104697],
  //         [0.1449, 40.131217],
  //         [0.145, 31.878217],
  //         [0.1451, 22.794916999999998],
  //         [0.1453, 12.345828999999998],
  //         [0.1454, 10.035642],
  //         [0.148, 9.326642],
  //         [0.1522, 3.76317],
  //       ],
  //       color: '#fc5857',
  //     },
  //   ],
  // };

  if (isLoading) {
    return <Skeleton className="w-full h-[330px] translate-y-12" />;
  }

  return (
    <div className="w-full translate-y-12">
      <HighchartsReact highcharts={Highcharts} options={data} />
    </div>
  );
};

export default OrderBookGraph;
