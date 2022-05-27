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
      supportCSSTransform
      smooth={true}
      xAxis={{
        // label: {
        //   offsetX: xField === 'powerMonth' ? 10 : 0,
        //   rotate: xField === 'powerMonth' ? 45 : 0,
        //   formatter: (text: string) => {
        //     return `${text}`;
        //   },
        // },
        label: {
          autoRotate: true,
          autoHide: false,
          autoEllipsis: false,
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
