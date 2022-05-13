import React from 'react';
import mapTop1 from '@/assets/mapTop1.png';
import mapTop2 from '@/assets/mapTop2.png';
import mapTop3 from '@/assets/mapTop3.png';
import styles from './index.less';

export interface DeviceIndexNumType {
  deviceNum: number;
  pointNum: number;
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
        <div className={styles.itemTitle}>节点数</div>
        <div className={styles.itemNumber}>
          {getNumberString(data.pointNum ?? 0)}
        </div>
      </div>
      <div className={styles.headerItem}>
        <img src={mapTop2} />
        <div className={styles.itemTitle}>机房数</div>
        <div className={styles.itemNumber}>
          {getNumberString(data.roomNum ?? 0)}
        </div>
      </div>
      <div className={styles.headerItem}>
        <img src={mapTop3} />
        <div className={styles.itemTitle}>设备数</div>
        <div className={styles.itemNumber}>
          {getNumberString(data.deviceNum ?? 0)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MapHeader);
