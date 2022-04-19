import React from 'react';
import styles from './index.less';

const AnimateBorder: React.FC = () => {
  return (
    <div className={styles.boxBorder}>
      <span className={styles.borderTop}></span>
      <span className={styles.borderLeft}></span>
      <span className={styles.borderBottom}></span>
      <span className={styles.borderRight}></span>
    </div>
  );
};

export default React.memo(AnimateBorder);
