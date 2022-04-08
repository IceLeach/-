import React from 'react';
import { DualAxes } from '@ant-design/plots';

interface AxesItemType {
  alarmMonth: number;
  alarmNum: number;
}
interface HistoryDualAxesProps {
  data: AxesItemType[];
}

const HistoryDualAxes: React.FC<HistoryDualAxesProps> = (props) => {
  const { data } = props;
  const axesData = data.map((d) => ({
    alarmMonth: `${d.alarmMonth}月`,
    alarmNum: d.alarmNum,
    alarmLine: d.alarmNum,
  }));

  return (
    <DualAxes
      // animation={false}
      data={[axesData, axesData]}
      xField="alarmMonth"
      yField={['alarmNum', 'alarmLine']}
      // appendPadding={[8, 0, 0, 0]}
      meta={{
        alarmNum: {
          alias: '告警次数',
        },
        alarmLine: {
          alias: ' ',
        },
      }}
      geometryOptions={[
        {
          geometry: 'column',
          color: ['#379FFF', '#72ECFF'],
          // color:(datum: Datum, defaultColor?: string) => '#5689F0',
          columnStyle: {
            radius: [20, 20, 0, 0],
          },
          // label: {
          //   formatter: (data: any) => {
          //     console.log('t', data)
          //     return data.alarmNum;
          //   },
          //   // autoHide: false,
          //   // style: {
          //   //   fill: 'red',
          //   //   color: '#000',
          //   //   fontSize: 80,
          //   //   stroke: 'red',
          //   //   // fontWeight: 'bold'
          //   // }
          // }
        },
        {
          geometry: 'line',
          color: '#E2E8FF',
          point: {
            shape: 'circle',
            size: 2.5,
            color: '#E2E8FF',
          },
          smooth: true,
        },
      ]}
      xAxis={{
        label: {
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
        },
        tickCount: data.length,
      }}
      yAxis={{
        alarmNum: {
          min: 0,
          // max: 60,
        },
        alarmLine: {
          min: 0,
          // max: 60,
          label: null,
        },
      }}
      tooltip={{
        customItems: (items) => [items[0]],
      }}
      legend={false}
    />
  );
};

export default React.memo(HistoryDualAxes);
