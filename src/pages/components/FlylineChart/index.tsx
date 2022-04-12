import React from 'react';
// @ts-ignore
import { FlylineChartEnhanced } from '@jiaminghi/data-view-react';
import map from '@/assets/nMap.png';
import mapPoint from '@/assets/mapPoint.png';
import mapCenterPoint from '@/assets/mapCenterPoint.png';
import mapErrorPoint from '@/assets/mapErrorPoint.png';
import mapCenterErrorPoint from '@/assets/mapCenterErrorPoint.png';

export interface pointType {
  corePoint: number;
  id: number;
  locateX: number;
  locateY: number;
  name: string;
}

interface FlylineChartProps {
  data: pointType[];
  errorPoints: number[];
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
  radius?: number;
}

const FlylineChart: React.FC<FlylineChartProps> = (props) => {
  const { data, errorPoints } = props;

  let corePointId: number | null = null;
  let corePointName: string | null = null;
  let corePointError: boolean = false;
  const points: MapPointType[] = data.map((d) => {
    if (d.corePoint === 1) {
      corePointId = d.id;
      corePointName = d.name;
      if (errorPoints.find((point) => point === d.id)) {
        corePointError = true;
      }
      return {
        name: d.name,
        coordinate: [d.locateX, d.locateY],
        halo: {
          show: true,
        },
        icon: {
          src: corePointError ? mapCenterErrorPoint : mapCenterPoint,
          width: 30,
          height: 30,
        },
        text: {
          // show: showNamePoint !== null && d.id === showNamePoint,
          show: false,
        },
      };
    }
    return {
      name: d.name,
      coordinate: [d.locateX, d.locateY],
      icon: {
        src: errorPoints.find((point) => point === d.id)
          ? mapCenterErrorPoint
          : mapPoint,
        width: 22,
        height: 22,
      },
      text: {
        // show: showNamePoint !== null && d.id === showNamePoint,
        show: false,
      },
    };
  });
  const lines: MapLineType[] = [];
  if (corePointId !== null && corePointName !== null) {
    data.forEach((d: any) => {
      if (d.id !== corePointId && corePointName !== null) {
        lines.push({
          source: d.name,
          target: corePointName,
          color: errorPoints.find((point) => point === d.id)
            ? 'transparent'
            : '#B5D3FB',
          orbitColor: errorPoints.find((point) => point === d.id)
            ? '#FC9249'
            : 'rgba(103,224,227,0.7)',
        });
      }
    });
  }
  // console.log('c', points, lines);

  return (
    <FlylineChartEnhanced
      config={{
        relative: false,
        points,
        lines,
        icon: {
          show: true,
          src: mapPoint,
          width: 30,
          height: 30,
        },
        text: {
          // show: false,
          color: '#fff',
        },
        bgImgSrc: map,
        line: {
          duration: [50, 50],
          width: 2,
          color: corePointError ? 'transparent' : '#B5D3FB',
        },
        curvature: 2.5,
        // k: -0.6
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default React.memo(FlylineChart);
