import React from 'react';
import { Progress } from 'antd';
import styles from './index.less';

interface CircleProgressProps {
  percent: number;
  percentColor: string;
  text: string;
  strokeColor: any;
  animationType: 'A' | 'B' | 'C';
}

const CircleProgress: React.FC<CircleProgressProps> = (props) => {
  const { percent, percentColor, text, strokeColor, animationType } = props;

  return (
    <Progress
      className={`${styles.progress} ${styles[`progress-${animationType}`]}`}
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
