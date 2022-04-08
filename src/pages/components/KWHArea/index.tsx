import React from 'react';
import { Area } from '@ant-design/plots';

interface KWHAreaProps {
  data: any[];
}

const KWHArea: React.FC<KWHAreaProps> = (props) => {
  const { data } = props;
  const areaData = data.map((d) => ({
    type: d.type,
    powerMonth: `${d.powerMonth}月`,
    powerNum: d.powerNum,
  }));

  return (
    <Area
      data={areaData}
      // isStack={false}
      xField="powerMonth"
      yField="powerNum"
      seriesField="type"
      smooth={true}
      xAxis={{
        label: {
          offsetX: 10,
          rotate: 45,
          // formatter: (text: string) => {
          //   return `${text}月`;
          // },
        },
      }}
    />
  );
};

export default React.memo(KWHArea);
