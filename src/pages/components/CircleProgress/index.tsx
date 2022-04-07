import React from 'react';
import { Progress } from 'antd';
import styles from './index.less';

interface CircleProgressProps {
  percent: number;
  percentColor: string;
  text: string;
  strokeColor: any;
}

const CircleProgress: React.FC<CircleProgressProps> = (props) => {
  const { percent, percentColor, text, strokeColor } = props;

  return (
    <Progress
      className={styles.progress}
      type="circle"
      trailColor="#3A4A6D"
      percent={percent}
      format={(percent) => (
        <div className={styles.progressText}>
          <div className={styles.percent} style={{ color: percentColor }}>
            {percent}%
          </div>
          <div className={styles.itemName}>{text}</div>
        </div>
      )}
      strokeColor={strokeColor}
    />
  );
};

export default React.memo(CircleProgress);
