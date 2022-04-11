import React from 'react';
import mapCenterPoint from '@/assets/mapCenterPoint.png';
import mapPoint from '@/assets/mapPoint.png';
import mapErrorPoint from '@/assets/mapErrorPoint.png';
import mapCenterErrorPoint from '@/assets/mapCenterErrorPoint.png';
import styles from './index.less';

const MapLegend: React.FC = () => {
  return (
    <div className={styles.legend}>
      <div className={styles.line}>
        <span className={styles.icons}>
          <img src={mapCenterPoint} className={styles.icon} />
        </span>
        <span>中心节点</span>
      </div>
      <div className={styles.line}>
        <span className={styles.icons}>
          <img src={mapPoint} className={styles.icon} />
        </span>
        <span>运行正常</span>
      </div>
      <div className={styles.line}>
        <span className={styles.icons}>
          <img src={mapErrorPoint} className={styles.icon} />
          <img src={mapCenterErrorPoint} className={styles.icon} />
        </span>
        <span>运行异常</span>
      </div>
      <div className={styles.line}>
        <span className={styles.icons}>
          <div style={{ height: 2, width: 20, background: '#B5D3FB' }}></div>
        </span>
        <span>正常线路</span>
      </div>
      <div className={styles.line}>
        <span className={styles.icons}>
          <div style={{ height: 2, width: 20, background: '#FC9249' }}></div>
        </span>
        <span>异常线路</span>
      </div>
    </div>
  );
};

export default React.memo(MapLegend);
