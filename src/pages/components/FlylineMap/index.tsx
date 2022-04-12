import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import FlylineChart, { pointType } from '../FlylineChart';

export interface FlylineMapProps {
  data: pointType[];
  errorPoints: number[];
  showNamePoint: number | null;
}

const FlylineMap: React.FC<FlylineMapProps> = (props) => {
  const { data, errorPoints, showNamePoint } = props;

  useEffect(() => {
    if (showNamePoint !== null) {
      const point = data.find((d) => d.id === showNamePoint);
      if (point) {
        const box = document.createElement('div');
        box.id = 'pointTextInnerBox';
        document.getElementById('pointTextBox')?.appendChild(box);
        const pointText = (
          <div
            id="pointText"
            style={{
              color: '#fff',
              fontSize: 12,
              userSelect: 'none',
              position: 'absolute',
              whiteSpace: 'nowrap',
              left: point.locateX - 15,
              top: point.locateY + 10,
            }}
          >
            {point.name}
          </div>
        );
        ReactDOM.render(pointText, box);
      }
    } else {
      const div = document.getElementById('pointTextInnerBox');
      if (div) {
        document.getElementById('pointTextBox')?.removeChild(div);
      }
    }
  }, [showNamePoint]);

  return (
    <>
      <div id="pointTextBox"></div>
      <FlylineChart data={data} errorPoints={errorPoints} />
    </>
  );
};

export default React.memo(FlylineMap);
