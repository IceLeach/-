import React from 'react';
import mapTop1 from '@/assets/mapTop1.png';
import mapTop2 from '@/assets/mapTop2.png';
import mapTop3 from '@/assets/mapTop3.png';
import styles from './index.less';

export interface DeviceIndexNumType {
  deviceNum: number;
  monitorNum: number;
  roomNum: number;
}

interface MapHeaderProps {
  data: DeviceIndexNumType;
}

const MapHeader: React.FC<MapHeaderProps> = (props) => {
  const { data } = props;

  const getNumberString = (num: number) => {
    const numString = `${num}`;
    if (numString.length < 4) {
      let zeroString = '';
      for (let i = 0; i < 4 - numString.length; i += 1) {
        zeroString += '0';
      }
      return zeroString + numString;
    }
    return numString;
  };

  return (
    <div className={styles.mapHeader}>
      <div className={styles.headerItem}>
        <img src={mapTop1} />
        <div className={styles.itemTitle}>接入节点数</div>
        <div className={styles.itemNumber}>
          {getNumberString(data.monitorNum)}
        </div>
      </div>
      <div className={styles.headerItem}>
        <img src={mapTop2} />
        <div className={styles.itemTitle}>接入机房数</div>
        <div className={styles.itemNumber}>{getNumberString(data.roomNum)}</div>
      </div>
      <div className={styles.headerItem}>
        <img src={mapTop3} />
        <div className={styles.itemTitle}>接入设备数</div>
        <div className={styles.itemNumber}>
          {getNumberString(data.deviceNum)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MapHeader);
