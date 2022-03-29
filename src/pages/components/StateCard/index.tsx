import React from 'react';
import styles from './index.less';

interface StateCardProps {
  successNum: number;
  errorNum: number;
}

const StateCard: React.FC<StateCardProps> = (props) => {
  const { successNum, errorNum } = props;

  return (
    <div className={styles.card}>
      <div className={styles.successState}>
        <div className={styles.successPoint}></div>
        <div className={styles.text}>正常</div>
        <div className={styles.successNumber}>{successNum}</div>
      </div>
      <div className={styles.errorState}>
        <div className={styles.errorPoint}></div>
        <div className={styles.text}>故障</div>
        <div className={styles.errorNumber}>{errorNum}</div>
      </div>
    </div>
  );
};

export default StateCard;
