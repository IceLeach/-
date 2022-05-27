import React from 'react';
import { DualAxes } from '@ant-design/plots';

// interface AxesItemType {
//   alarmMonth: number;
//   alarmNum: number;
// }
interface HistoryDualAxesProps {
  data: any[];
  xField: string;
}

const HistoryDualAxes: React.FC<HistoryDualAxesProps> = (props) => {
  const { data, xField } = props;
  let maxNum = 0;
  data.forEach((d) => {
    if (d.alarmNum > maxNum) {
      maxNum = d.alarmNum;
    }
  });
  const axesData = data.map((d) => ({
    alarmMonth: `${d[xField]}`,
    alarmNum: d.alarmNum,
    alarmLine: d.alarmNum,
  }));

  return (
    <DualAxes
      // animation={false}
      data={[axesData, axesData]}
      xField="alarmMonth"
      yField={['alarmNum', 'alarmLine']}
      supportCSSTransform
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
          //     // console.log('t', data)
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
          label: {
            formatter: (data: any) => {
              return data.alarmNum;
            },
            style: {
              fill: '#fff',
            },
          },
        },
      ]}
      xAxis={{
        label: {
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
        },
        // label: {
        //   offsetX: xField === 'alarmMonth' ? 10 : 0,
        //   rotate: xField === 'alarmMonth' ? 45 : 0,
        //   formatter: (text: string) => {
        //     return `${text}`;
        //   },
        // },
        tickCount: data.length,
      }}
      yAxis={{
        alarmNum: {
          min: 0,
          max: maxNum * 1.1,
        },
        alarmLine: {
          min: 0,
          max: maxNum * 1.1,
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
