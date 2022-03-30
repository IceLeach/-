import React from 'react';
import { DualAxes } from '@ant-design/plots';

interface HistoryDualAxesProps {
  data: any[];
}

const HistoryDualAxes: React.FC<HistoryDualAxesProps> = (props) => {
  const { data } = props;

  return (
    <DualAxes
      // animation={false}
      data={[data, data]}
      xField="time"
      yField={['alarm', 'alarmLine']}
      meta={{
        alarm: {
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
          columnStyle: {
            radius: [20, 20, 0, 0],
          },
        },
        {
          geometry: 'line',
          color: '#E2E8FF',
          point: {
            shape: 'circle',
            size: 2.5,
            color: '#E2E8FF',
          },
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
        alarm: {
          min: 0,
          max: 60,
        },
        alarmLine: {
          min: 0,
          max: 60,
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
