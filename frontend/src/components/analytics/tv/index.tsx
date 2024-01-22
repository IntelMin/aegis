import dynamic from 'next/dynamic';
import { ChartProps } from './TVChart';
import { Skeleton } from '@/components/ui/skeleton';

// @ts-ignore
const TVChartContainer = dynamic<TVChart>(
  () => import('./TVChart').then(mod => mod.TVChart),
  {
    ssr: false,
  }
);

const ChartComponent = (props: ChartProps) => <TVChartContainer {...props} />;
ChartComponent.displayName = 'ChartComponent';

export default ChartComponent;
