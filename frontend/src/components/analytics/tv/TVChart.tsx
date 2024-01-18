import { useRef, useEffect } from 'react';
import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  TimeFrameItem,
  widget,
} from './charting_library/charting_library';
import { DEFAULT_RESOLUTION } from './constants';
import DataFeedFactory from './DataFeed';
import { loadChartState, saveChartState } from './utils';

export type ChartProps = {
  initialPrice: string;
  onChartReady?: () => void;
  pairAddress: string;
};

export type Props = ChartProps & {
  interval: string;
  containerId: string;
  libraryPath: string;
  fullscreen: boolean;
  autosize: boolean;
  studiesOverrides: Record<string, any>;
  overrides: Record<string, string>;
};

export function TVChart({
  interval = DEFAULT_RESOLUTION,
  containerId = 'tv_chart_container',
  libraryPath = '/static/charting_library/',
  fullscreen = false,
  autosize = true,
  studiesOverrides = {},
  initialPrice,
  pairAddress,
  onChartReady = () => {
    return;
  },
}: Props) {
  const _widget = useRef<IChartingLibraryWidget | null>(null);

  const DEFAULT_OVERRIDES = {
    'paneProperties.background': '#232243',
    'chartProperties.background': '#242424',
    'paneProperties.backgroundType': 'solid',
  };

  const marketAsset = 'ETH';

  const decimals =
    Number(initialPrice) > 100 && Number(initialPrice) < 1000
      ? 3
      : Number(initialPrice);
  const chartScale = 10 ** decimals;

  useEffect(() => {
    const chartData = loadChartState();

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: marketAsset + ':sUSD',
      datafeed: DataFeedFactory(1, chartScale, pairAddress),
      interval: interval as ResolutionString,
      container: containerId,
      library_path: libraryPath,
      locale: 'en',
      disabled_features: [
        'header_compare',
        'hide_left_toolbar_by_default',
        'study_templates',
        'header_symbol_search',
        'display_market_status',
        'create_volume_indicator_by_default',
      ],
      fullscreen: fullscreen,
      autosize: autosize,
      studies_overrides: studiesOverrides,
      theme: 'Dark',
      custom_css_url: './theme.css',
      loading_screen: {
        backgroundColor: '#242424',
      },
      overrides: DEFAULT_OVERRIDES,
      toolbar_bg: '#121212',
      time_frames: [
        { text: '4H', resolution: '5', description: '4 hours' },
        { text: '12H', resolution: '5', description: '1 Day' },
        { text: '1D', resolution: '15', description: '1 Day' },
        { text: '5D', resolution: '15', description: '5 Days' },
        { text: '1M', resolution: '1H', description: '1 Month' },
        { text: '3M', resolution: '1H', description: '3 Months' },
      ] as TimeFrameItem[],
      saved_data: chartData,
    };

    const clearExistingWidget = () => {
      if (_widget.current !== null) {
        _widget.current.remove();
        _widget.current = null;
      }
    };

    clearExistingWidget();

    // @ts-ignore complains about `container` item missing
    const tvWidget = new widget(widgetOptions);
    _widget.current = tvWidget;

    _widget.current?.onChartReady(() => {
      _widget.current?.applyOverrides(DEFAULT_OVERRIDES);
      onChartReady();
    });

    return () => {
      clearExistingWidget();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartScale]);

  useEffect(() => {
    _widget.current?.onChartReady(() => {
      const symbolInterval = _widget.current?.symbolInterval();
      _widget.current?.setSymbol(
        marketAsset + ':sUSD',
        symbolInterval?.interval ?? DEFAULT_RESOLUTION,
        () => {}
      );
    });
  }, [marketAsset]);

  useEffect(() => {
    const handleAutoSave = () => {
      _widget.current?.save(saveChartState);
    };

    _widget.current?.subscribe('onAutoSaveNeeded', handleAutoSave);

    return () => {
      _widget.current?.unsubscribe('onAutoSaveNeeded', handleAutoSave);
    };
  }, []);

  return (
    <div
      id={containerId}
      className="min-h-[400px]"
      style={{ height: '100%' }}
    />
  );
}
