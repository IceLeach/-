import React from 'react';
import { Area } from '@ant-design/plots';

interface KWHAreaProps {
  data: any[];
  xField: string;
}

const KWHArea: React.FC<KWHAreaProps> = (props) => {
  const { data, xField } = props;
  const areaData = data.map((d, i) => ({
    type: d.type,
    powerMonth: `${d[xField]}`,
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
          // offsetX: 10,
          // rotate: 45,
          // formatter: (text: string) => {
          //   return `${text}月`;
          // },
        },
      }}
      // label={{
      //   formatter: (d) => {
      //     console.log(d)
      //     return d.powerNum;
      //   },
      //   // offsetY: -5,
      //   style: {
      //     fill: '#fff',
      //   }
      // }}
    />
  );
};

export default React.memo(KWHArea);
