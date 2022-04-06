import React from 'react';
// @ts-ignore
import { FlylineChartEnhanced } from '@jiaminghi/data-view-react';
import map from '@/assets/nMap.png';
import mapPoint from '@/assets/mapPoint.png';
import mapCenterPoint from '@/assets/mapCenterPoint.png';

interface pointType {
  corePoint: number;
  id: number;
  locateX: number;
  locateY: number;
  name: string;
}

interface FlylineChartProps {
  data: pointType[];
}

interface MapPointType {
  name: string;
  coordinate: number[];
  icon?: any;
  text?: any;
}

interface MapLineType {
  source: string;
  target: string;
  color?: string;
  orbitColor?: string;
}

const FlylineChart: React.FC<FlylineChartProps> = (props) => {
  const { data } = props;

  let corePointId: number | null = null;
  let corePointName: string | null = null;
  const points: MapPointType[] = data.map((d: any) => {
    if (d.corePoint === 1) {
      corePointId = d.id;
      corePointName = d.name;
      return {
        name: d.name,
        coordinate: [d.locateX, d.locateY],
        icon: {
          src: mapCenterPoint,
          width: 30,
          height: 30,
        },
      };
    }
    return {
      name: d.name,
      coordinate: [d.locateX, d.locateY],
    };
  });
  const lines: MapLineType[] = [];
  if (corePointId !== null && corePointName !== null) {
    data.forEach((d: any) => {
      if (d.id !== corePointId && corePointName !== null) {
        lines.push({
          source: d.name,
          target: corePointName,
        });
      }
    });
  }
  console.log('c', points, lines);

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
          show: false,
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
