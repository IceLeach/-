import { DeviceGetMonitoring } from '@/services/api';
import { CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import styles from './index.less';

interface DraggableModalProps {
  data: {
    id: string;
    name: string;
  };
  defaultPosition: {
    x: number;
    y: number;
  };
  onClose: () => void;
  saveInterval: (interval: NodeJS.Timer) => void;
}

const DraggableModal: React.FC<DraggableModalProps> = (props) => {
  const { data, defaultPosition, onClose, saveInterval } = props;
  const runtimeRef = useRef<NodeJS.Timer | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);

  const closeModal = () => {
    if (runtimeRef.current) {
      clearInterval(runtimeRef.current);
    }
    onClose();
  };

  useEffect(() => {
    const getMonitoring = () => {
      DeviceGetMonitoring({ id: parseInt(data.id) }).then((res) => {
        // console.log('res', res);
        if (res?.data) {
          setModalData(res.data);
        }
      });
    };
    if (runtimeRef.current) {
      clearInterval(runtimeRef.current);
    }
    getMonitoring();
    runtimeRef.current = setInterval(getMonitoring, 10000);
    saveInterval(runtimeRef.current);
  }, []);

  return (
    <Draggable key={data.id} defaultPosition={defaultPosition}>
      <div className={styles.dragBox}>
        <CloseOutlined className={styles.closeButton} onClick={closeModal} />
        <div className={styles.title}>{data.name}</div>
        <div className={styles.dataBox}>
          {modalData.map((data) => (
            <div className={styles.dataItem} key={data.id}>
              <span
                title={data.name}
                style={{
                  paddingLeft: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {data.name}
              </span>
              <span style={{ paddingRight: 8, marginLeft: 'auto' }}>
                {data.value && (
                  <span
                    style={{ color: data.alarm === 1 ? '#FF5151' : '#6CFF9A' }}
                  >
                    {data.value}
                  </span>
                )}
                {data.value && data.unit && (
                  <span className={styles.unit}>{data.unit}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
};

export default React.memo(DraggableModal);
