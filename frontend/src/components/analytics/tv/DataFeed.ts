import {
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from './charting_library/charting_library';

import { ChartBar } from './types';
import { resolutionToSeconds } from './utils';

const supportedResolutions = [
  '1',
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '480',
  '720',
  '1D',
  '3D',
  '7D',
  '30D',
] as ResolutionString[];

type PricesListener = (update: PricesUpdate) => void;

type PricesUpdate = {
  type: 'off_chain';
  prices: {
    [asset: string]: Number;
  };
};

const _pricesListener: { current: PricesListener | undefined } = {
  current: undefined,
};

const _latestChartBar: {
  current: { bar: ChartBar; asset: string } | undefined;
} = {
  current: undefined,
};

const config = {
  supports_search: false,
  supports_group_request: true,
  supported_resolutions: supportedResolutions,
};

// symbolName name split from BASE:QUOTE
const splitBaseQuote = (symbolName: string) => {
  var split_data = symbolName.split(/[:/]/);
  const base = split_data[0];
  const quote = split_data[1];
  return { base, quote };
};

function requestCandlesticks(
  arg0: any,
  from: number,
  to: number,
  arg3: number,
  networkId: number
) {
  throw new Error('Function not implemented.');
}

function getDisplayAsset(base: string) {
  return '';
}

const fetchCombinedCandles = async (
  base: string,
  from: number,
  to: number,
  resolution: ResolutionString,
  networkId: number
) => {
  const candleData = await requestCandlesticks(
    getDisplayAsset(base)?.toUpperCase() ?? '',
    from,
    to,
    resolutionToSeconds(resolution),
    networkId
  );
  return candleData;
};

const updateBar = (bar: ChartBar, price: number) => {
  const high = Math.max(bar.high, price);
  const low = Math.min(bar.low, price);
  return {
    ...bar,
    low,
    high,
    close: price,
  };
};

const subscribeOffChainPrices = (
  asset: string,
  resolution: ResolutionString,
  onTick: SubscribeBarsCallback
) => {
  //   if (_pricesListener.current) {
  //     sdk.prices.removePricesListener(_pricesListener.current)
  //   }
  const listener: PricesListener = ({ type, prices }) => {
    if (type === 'off_chain') {
      const price = '23';
      //   const price = prices[asset]
      if (price) {
        if (_latestChartBar.current?.asset !== asset) return;
        const priceNum = parseInt(price);
        if (
          _latestChartBar.current &&
          priceNum !== _latestChartBar.current.bar.close
        ) {
          const updatedBar = updateBar(_latestChartBar.current.bar, priceNum);
          const resolutionMs = resolutionToSeconds(resolution) * 1000;
          const timeSinceUpdate = Date.now() - updatedBar.time;

          if (timeSinceUpdate > resolutionMs) {
            const lastClose = _latestChartBar.current.bar.close;
            const latestBar = {
              high: lastClose,
              low: lastClose,
              open: lastClose,
              close: lastClose,
              time: Date.now(),
            };
            onTick(latestBar);
            _latestChartBar.current = {
              bar: latestBar,
              asset: asset,
            };
          } else {
            onTick(updatedBar);
            _latestChartBar.current = {
              bar: updatedBar,
              asset: asset,
            };
          }
        }
      }
    }
  };
  _pricesListener.current = listener;
  //   sdk.prices.onPricesUpdated(listener)
  return listener;
};

function onSubscribe(listener: PricesListener) {
  throw new Error('Function not implemented.');
}

const DataFeedFactory = (
  networkId: number,
  chartScale: number,
  pairAddress: string
): IBasicDataFeed => {
  _latestChartBar.current = undefined;
  return {
    onReady: (cb: OnReadyCallback) => {
      setTimeout(() => cb(config), 500);
    },
    resolveSymbol: (
      symbolName: string,
      onSymbolResolvedCallback: (val: any) => any
    ) => {
      const { base, quote } = splitBaseQuote(symbolName);

      var symbol_stub = {
        name: symbolName,
        description: `${base} / ${quote}`,
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        ticker: symbolName,
        exchange: '',
        minmov: 1,
        pricescale: chartScale,
        has_intraday: true,
        intraday_multipliers: supportedResolutions,
        supported_resolution: supportedResolutions,
        volume_precision: 8,
        data_status: 'streaming',
      };

      setTimeout(function () {
        onSymbolResolvedCallback(symbol_stub);
      }, 0);
    },
    getBars: function (
      symbolInfo: LibrarySymbolInfo,
      _resolution: ResolutionString,
      { from, to }: PeriodParams,
      onHistoryCallback: HistoryCallback,
      onErrorCallback: (error: any) => any
    ) {
      const query = [
        ['span', 'month'],
        ['pair', pairAddress],
        ['ts', from],
        ['res', _resolution],
      ]
        .map(([name, value]) => `${name}=${value}`)
        .join('&');

      fetch(`/api/tv?${query}`)
        .then(res => res.json())
        .then(res => {
          onHistoryCallback(res.data.candles);
        });

      // const { base } = splitBaseQuote(symbolInfo.name)

      // try {
      //   fetchCombinedCandles(base, from, to, _resolution, networkId).then((bars) => {
      //     const chartBars = bars.map((b) => {
      //       return {
      //         high: b.high,
      //         low: b.low,
      //         open: b.open,
      //         close: b.close,
      //         time: b.timestamp * 1000,
      //       }
      //     })
      //     const latestBar = chartBars[chartBars.length - 1]
      //     if (latestBar && latestBar.time > (_latestChartBar.current?.bar.time ?? 0)) {
      //       _latestChartBar.current = {
      //         bar: chartBars[chartBars.length - 1],
      //         asset: base,
      //       }
      //     }

      //     onHistoryCallback(chartBars, { noData: !chartBars.length })
      //   })
      // } catch(err) {
      //   onErrorCallback(err)
      // }
    },
    subscribeBars: (
      symbolInfo: LibrarySymbolInfo,
      _resolution: ResolutionString,
      onTick: SubscribeBarsCallback
    ) => {
      const { base } = splitBaseQuote(symbolInfo.name);

      // subscribe to off chain prices
      const listener = subscribeOffChainPrices(
        base as 'ETH',
        _resolution,
        onTick
      );
      onSubscribe(listener);
    },
    unsubscribeBars: () => {},
    searchSymbols: (
      userInput: string,
      exchange: string,
      symbolType: string,
      onResult: SearchSymbolsCallback
    ) => {
      onResult([]);
    },
  };
};

export default DataFeedFactory;
