import React from 'react';
// @ts-ignore
import { FlylineChartEnhanced } from '@jiaminghi/data-view-react';
import map from '@/assets/nMap.png';
import mapPoint from '@/assets/mapPoint.png';

interface FlylineChartProps {
  points: any[];
  lines: any[];
}

const FlylineChart: React.FC<FlylineChartProps> = (props) => {
  const { points, lines } = props;

  return (
    <FlylineChartEnhanced
      config={{
        relative: false,
        points,
        lines,
        icon: {
          show: true,
          src: mapPoint,
        },
        text: {
          show: true,
        },
        bgImgSrc: map,
        line: {
          duration: [20, 20],
          width: 2,
          color: '#0BD08D',
        },
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default React.memo(FlylineChart);
