import {
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from './charting_library/charting_library'

import { ChartBar } from './types'

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
] as ResolutionString[]

const config = {
  supports_search: false,
  supports_group_request: true,
  supported_resolutions: supportedResolutions,
}

// symbolName name split from BASE:QUOTE
const splitBaseQuote = (symbolName: string) => {
  var split_data = symbolName.split(/[:/]/)
  const base = split_data[0]
  const quote = split_data[1]
  return { base, quote }
}

const DataFeedFactory = (
  chartScale: number,
  pairAddress: string,
): IBasicDataFeed => {
  return {
    onReady: (cb: OnReadyCallback) => {
      setTimeout(() => cb(config), 500)
    },
    resolveSymbol: (symbolName: string, onSymbolResolvedCallback: (val: any) => any) => {
      const { base, quote } = splitBaseQuote(symbolName)

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
      }

      setTimeout(function () {
        onSymbolResolvedCallback(symbol_stub)
      }, 0)
    },
    getBars: function (
      symbolInfo: LibrarySymbolInfo,
      res: ResolutionString,
      { from, to }: PeriodParams,
      onHistoryCallback: HistoryCallback,
      onErrorCallback: (error: any) => any
    ) {
      fetch(`/api/tv?pair=${pairAddress}&res=${res}&from=${from}&to=${to}}`)
        .then(res => res.json())
        .then(res => {
          onHistoryCallback(res.map(item => ({
            high: item.h,
            low: item.l,
            open: item.o,
            close: item.c,
            time: new Date(item.dt).getTime()
          }), { noData: false }))
        })
    },
    subscribeBars: (
      symbolInfo: LibrarySymbolInfo,
      _resolution: ResolutionString,
      onTick: SubscribeBarsCallback
    ) => {
    },
    unsubscribeBars: () => { },
    searchSymbols: (
      userInput: string,
      exchange: string,
      symbolType: string,
      onResult: SearchSymbolsCallback
    ) => {
      onResult([])
    },
  }
}

export default DataFeedFactory
