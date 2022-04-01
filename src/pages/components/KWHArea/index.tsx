import React from 'react';
import { Area } from '@ant-design/plots';

interface KWHAreaProps {
  data: any[];
}

const KWHArea: React.FC<KWHAreaProps> = (props) => {
  const { data } = props;

  return (
    <Area
      data={data}
      // isStack={false}
      xField="month"
      yField="percent"
      seriesField="type"
      xAxis={{
        label: {
          offsetX: 10,
          rotate: 45,
          formatter: (text: string) => {
            return `${text}月`;
          },
        },
      }}
    />
  );
};

export default React.memo(KWHArea);
