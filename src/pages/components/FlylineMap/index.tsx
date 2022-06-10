import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import FlylineChart, { pointType } from '../FlylineChart';

export interface FlylineMapProps {
  data: pointType[];
  errorData: {
    line: number[];
    point: number[];
  };
  showNamePoint: number | null;
}

const FlylineMap: React.FC<FlylineMapProps> = (props) => {
  const { data, errorData, showNamePoint } = props;

  useEffect(() => {
    if (showNamePoint !== null) {
      const point = data.find((d) => d.id === showNamePoint);
      if (point) {
        const box = document.createElement('div');
        box.id = 'pointTextInnerBox';
        document.getElementById('pointTextBox')?.appendChild(box);
        const pointText = (
          <>
            <div
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                left: point.locateX + 8,
                top: point.locateY - 10,
                cursor: point.linked === 1 ? 'pointer' : 'not-allowed',
              }}
            ></div>
            <div
              id="pointText"
              style={{
                color: '#fff',
                fontSize: 12,
                userSelect: 'none',
                position: 'absolute',
                whiteSpace: 'nowrap',
                zIndex: 1,
                left: point.locateX - 15,
                top: point.locateY + 12,
                background: '#0E2B68',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {point.name}
            </div>
          </>
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
      <FlylineChart data={data} errorData={errorData} />
    </>
  );
};

export default React.memo(FlylineMap);
