import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'umi';
import { Radio, Select, Spin, Tabs } from 'antd';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import G6, { Graph } from '@antv/g6';
import {
  AlarmEventGetLatest,
  AlarmEventGetSumList,
  DeviceGetAlarmOfDevice,
  DeviceGetAlarmOfPoint,
  DeviceGetIndexNum,
  DeviceGetPowerOfDevice,
  DeviceGetRoomOfDeviceList,
  DeviceGetSumList,
  DeviceGetTypeList,
  DeviceThi,
  MapGetPowerSumList,
  MapGetRunTime,
  MapPointList,
} from '@/services/api';
import { apiUrl, fileUrl } from '@/utils/request';
import { cloneDeep } from 'lodash';
import ReactDOM from 'react-dom';
import DraggableModal from './components/DraggableModal';
// import ScrollTable, { scrollRef } from './components/ScrollTable';
import StateCard from './components/StateCard';
import HistoryDualAxes from './components/HistoryDualAxes';
// import DateTime from './components/DateTime';
import AlarmTable from './components/AlarmTable';
import THTable, { THTableRow } from './components/THTable';
import KWHArea from './components/KWHArea';
import MapHeader, { DeviceIndexNumType } from './components/MapHeader';
import CircleProgress from './components/CircleProgress';
import MapLegend from './components/MapLegend';
import FlylineMap from './components/FlylineMap';
import DateTime from './components/DateTime';
import AnimateBorder from './components/AnimateBorder';
// @ts-ignore
import logo from '@/assets/logo.jpg';
// @ts-ignore
import logoIcon from '@/assets/logo.ico';
import styles from './index.less';

interface RuntimeRefType {
  zoom: number;
  leftTabsInterval: NodeJS.Timer | null;
  leftSelectInterval: NodeJS.Timer | null;
  // scrollTableInterval: NodeJS.Timer | null;
  rightTabsInterval: NodeJS.Timer | null;
  mapAlarmPointInterval: NodeJS.Timer | null;
  roomAlarmPointInterval: NodeJS.Timer | null;
  pointModalList: string[];
  pointIntervalList: NodeJS.Timer[];
}
interface RightTopDataType {
  groupKey: string;
  groupName: string;
  groupData: THTableRow[];
}

interface DeviceSumListType {
  normalNum: number;
  faultNum: number;
  type: string;
}

interface AlarmEventSumListType {
  alarmMonth: number;
  alarmNum: number;
}

interface ProgressDataItemType {
  normalNum: number;
  faultNum: number;
  sum: number;
}

interface ProgressDataType {
  commercial?: ProgressDataItemType;
  ups?: ProgressDataItemType;
  airConditioner?: ProgressDataItemType;
}

interface DeviceThiDataType {
  groupKey: string;
  groupName: string;
  groupData: any[];
}

interface MapPercentDataType {
  id: number;
  x: number;
  y: number;
  accessX: number[];
  accessY: number[];
}

interface InnerMapDataType {
  inner: boolean;
  data: {
    pointId: number;
    roomId: number;
    roomName: string;
    roomPicPath: string;
  } | null;
}

const IndexPage: React.FC = () => {
  const [leftActiveKey, setLeftActiveKey] = useState<string>('0');
  const [rightActiveKey, setRightActiveKey] = useState<string>('0');
  const [leftSelectKey, setLeftSelectKey] = useState<number | null>(null);
  const [bottomBoxUp, setBottomBoxUp] = useState<boolean>(false);
  // const [scrollPause, setScrollPause] = useState<boolean>(false);
  const [isInnerMap, setIsInnerMap] = useState<InnerMapDataType>({
    inner: false,
    data: null,
  });
  const [innerGraph, setInnerGraph] = useState<Graph | null>(null);
  // const [weatherData, setWeatherData] = useState<any>({});
  const [mapData, setMapData] = useState<any[]>([]);
  const [mapPercentData, setMapPercentData] = useState<MapPercentDataType[]>(
    [],
  );
  const [deviceTypeList, setDeviceTypeList] = useState<string[]>([]);
  const [deviceSumList, setDeviceSumList] = useState<DeviceSumListType[]>([]);
  const [deviceIndexNum, setDeviceIndexNum] = useState<DeviceIndexNumType>({
    deviceNum: 0,
    monitorNum: 0,
    roomNum: 0,
  });
  const [alarmEventLatest, setAlarmEventLatest] = useState<any[]>([]);
  const [alarmEventSumList, setAlarmEventSumList] = useState<
    AlarmEventSumListType[]
  >([]);
  const [progressData, setProgressData] = useState<ProgressDataType>({});
  const [deviceAlarmPointData, setDeviceAlarmPointData] = useState<number[]>(
    [],
  );
  const [deviceThiData, setDeviceThiData] = useState<DeviceThiDataType[]>([]);
  const [mapPowerSumList, setMapPowerSumList] = useState<any[]>([]);
  const [showNamePoint, setShowNamePoint] = useState<number | null>(null);
  const [runTime, setRunTime] = useState<number | null>(null);
  const [leftRadioValue, setLeftRadioValue] = useState<number>(1);
  const [rightRadioValue, setRightRadioValue] = useState<number>(1);
  const runtimeRef = useRef<RuntimeRefType>({
    zoom: 1,
    leftTabsInterval: null,
    leftSelectInterval: null,
    // scrollTableInterval: null,
    rightTabsInterval: null,
    mapAlarmPointInterval: null,
    roomAlarmPointInterval: null,
    pointModalList: [],
    pointIntervalList: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // const ws = useRef<WebSocket | null>(null);
  // const [message, setMessage] = useState('');
  // const [readyState, setReadyState] = useState('正在链接中');

  // const webSocketInit = useCallback(() => {
  //   const stateArr = [
  //     '正在链接中',
  //     '已经链接并且可以通讯',
  //     '连接正在关闭',
  //     '连接已关闭或者没有链接成功',
  //   ];
  //   if (!ws.current || ws.current.readyState === 3) {
  //     ws.current = new WebSocket(''); // ws://localhost:7070
  //     ws.current.onopen = (_e) =>
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //     ws.current.onclose = (_e) =>
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //     ws.current.onerror = (e) =>
  //       setReadyState(stateArr[ws.current?.readyState ?? 0]);
  //     ws.current.onmessage = (e) => {
  //       setMessage(e.data || e);
  //     };
  //   }
  // }, [ws]);
  // const closeWebSocket = useCallback(() => {
  //   ws.current?.close();
  // }, [ws]);

  const clearRefInterval = (interval: NodeJS.Timer | null) => {
    if (interval) {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    console.log('w', window.screen.width);
    const zoom = document.body.clientWidth / 1920;
    runtimeRef.current.zoom = zoom;
    // @ts-ignore
    // document.getElementById('main')!.style.zoom = `${zoom}`;
    document.getElementById('main')!.style.transform = `scale(${zoom},${zoom})`;
    document.getElementById('main')!.style.transformOrigin = 'left top';
    // document.body.style.transform = `scale(${zoom},${zoom})`;
    // document.body.style.transformOrigin = 'left top';
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [document.body.clientWidth]);

  useEffect(() => {
    MapPointList().then((res) => {
      if (res?.data) {
        setMapData(res.data);
        const points = res.data.map((d: any) => ({
          id: d.id,
          x: d.locateX / 900,
          y: d.locateY / 700,
          accessX:
            d.corePoint === 1
              ? [d.locateX / 900 - 0.008, d.locateX / 900 + 0.008]
              : [d.locateX / 900 - 0.006, d.locateX / 900 + 0.006],
          accessY:
            d.corePoint === 1
              ? [d.locateY / 700 - 0.009, d.locateY / 700 + 0.009]
              : [d.locateY / 700 - 0.007, d.locateY / 700 + 0.007],
        }));
        setMapPercentData(points);
        const selectedPoint = res.data.find((d: any) => d.selected === 1);
        setLeftSelectKey(selectedPoint ? selectedPoint.id : res.data[0].id);
      }
    });
    DeviceGetTypeList().then((res) => {
      if (res?.data) {
        setDeviceTypeList(res.data);
      }
    });
    DeviceGetIndexNum().then((res) => {
      if (res?.data) {
        setDeviceIndexNum(res.data);
      }
    });
    AlarmEventGetSumList({ type: rightRadioValue }).then((res) => {
      if (res?.data) {
        setAlarmEventSumList(res.data);
      }
    });
    MapGetRunTime().then((res) => {
      if (res?.data) {
        setRunTime(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const getDeviceSumListData = () => {
      DeviceGetSumList().then((res) => {
        if (res?.data) {
          setDeviceSumList(res.data);
        }
      });
    };
    const getAlarmEventLatest = () => {
      AlarmEventGetLatest().then((res) => {
        if (res?.data) {
          setAlarmEventLatest(res.data);
        }
      });
    };
    const getDeviceThi = () => {
      DeviceThi().then((res) => {
        if (res?.data) {
          const rtData: RightTopDataType[] = [];
          for (let i = 0; i < Math.ceil(res.data.length / 5); i += 1) {
            rtData.push({
              groupKey: `${i}`,
              groupName: `第${i + 1}页`,
              groupData: res.data.slice(i * 5, (i + 1) * 5),
            });
          }
          setDeviceThiData(rtData);
        }
      });
    };
    getDeviceSumListData();
    getAlarmEventLatest();
    getDeviceThi();
    const deviceSumList = setInterval(getDeviceSumListData, 10000);
    const alarmEvent = setInterval(getAlarmEventLatest, 10000);
    const deviceThi = setInterval(getDeviceThi, 10000);

    return () => {
      clearInterval(deviceSumList);
      clearInterval(alarmEvent);
      clearInterval(deviceThi);
    };
  }, []);

  useEffect(() => {
    if (leftSelectKey !== null) {
      const getAction = () => {
        DeviceGetPowerOfDevice({ id: leftSelectKey }).then((res) => {
          if (res?.data) {
            const commercial = res.data.find((d: any) => d.type === '市电');
            const ups = res.data.find((d: any) => d.type === 'UPS电');
            const airConditioner = res.data.find((d: any) => d.type === '空调');
            const data = {
              commercial: commercial
                ? {
                    normalNum: commercial.normalNum,
                    faultNum: commercial.faultNum,
                    sum: commercial.normalNum + commercial.faultNum,
                  }
                : undefined,
              ups: ups
                ? {
                    normalNum: ups.normalNum,
                    faultNum: ups.faultNum,
                    sum: ups.normalNum + ups.faultNum,
                  }
                : undefined,
              airConditioner: airConditioner
                ? {
                    normalNum: airConditioner.normalNum,
                    faultNum: airConditioner.faultNum,
                    sum: airConditioner.normalNum + airConditioner.faultNum,
                  }
                : undefined,
            };
            setProgressData(data);
          }
        });
      };
      getAction();
      clearRefInterval(runtimeRef.current.leftSelectInterval);
      runtimeRef.current.leftSelectInterval = setInterval(getAction, 10000);
      MapGetPowerSumList({ id: leftSelectKey, type: leftRadioValue }).then(
        (res) => {
          if (res?.data) {
            setMapPowerSumList(res.data);
          }
        },
      );
    }

    return () => {
      clearRefInterval(runtimeRef.current.leftSelectInterval);
    };
  }, [leftSelectKey]);

  useEffect(() => {
    const getMapAlarmPoint = () => {
      DeviceGetAlarmOfPoint().then((res) => {
        if (res?.data) {
          setDeviceAlarmPointData(res.data);
        }
      });
    };
    if (isInnerMap.inner) {
      clearRefInterval(runtimeRef.current.mapAlarmPointInterval);
    } else {
      clearRefInterval(runtimeRef.current.roomAlarmPointInterval);
      clearRefInterval(runtimeRef.current.mapAlarmPointInterval);
      getMapAlarmPoint();
      runtimeRef.current.mapAlarmPointInterval = setInterval(
        getMapAlarmPoint,
        10000,
      );
    }

    return () => {
      clearRefInterval(runtimeRef.current.mapAlarmPointInterval);
    };
  }, [isInnerMap.inner]);

  // const getWeather = () => {
  //   const cityCode = '101210401';
  //   const url = `/weather/data/cityinfo/${cityCode}.html`;
  //   // const url = `/weather/data/sk/${cityCode}.html`;
  //   fetch(url).then((res) => {
  //     res.json().then((resJson) => {
  //       setWeatherData(resJson?.weatherinfo ?? {});
  //     });
  //   });
  // };

  const changeLeftTab = () => {
    setLeftActiveKey((activeKey) => {
      const key: number = parseInt(activeKey);
      if (key + 1 < deviceTypeList.length) {
        return `${key + 1}`;
      } else {
        return '0';
      }
    });
  };
  const startLeftTabsInterval = () => {
    clearRefInterval(runtimeRef.current.leftTabsInterval);
    if (deviceTypeList.length > 0) {
      runtimeRef.current.leftTabsInterval = setInterval(changeLeftTab, 8000);
    }
  };

  const changeRightTab = () => {
    setRightActiveKey((activeKey) => {
      const key: number = parseInt(activeKey);
      if (key + 1 < deviceThiData.length) {
        return `${key + 1}`;
      } else {
        return '0';
      }
    });
  };
  const startRightTabsInterval = () => {
    clearRefInterval(runtimeRef.current.rightTabsInterval);
    if (deviceTypeList.length > 0) {
      runtimeRef.current.rightTabsInterval = setInterval(changeRightTab, 8000);
    }
  };
  // const tableScroll = () => {
  //   scrollRef && scrollRef.slickNext();
  // };

  useEffect(() => {
    startLeftTabsInterval();
  }, [deviceTypeList]);

  useEffect(() => {
    startRightTabsInterval();
  }, [deviceThiData]);

  // const getScrollLimit = (maxCount: number) => {
  //   if (bottomData.length >= maxCount) {
  //     return maxCount;
  //   } else {
  //     return bottomData.length;
  //   }
  // };

  const closeDragBox = (id: string) => {
    const box = document.getElementById(id);
    if (box) {
      document.getElementById('dragBoxArea')?.removeChild(box);
    }
  };
  const saveInterval = (interval: NodeJS.Timer) => {
    runtimeRef.current.pointIntervalList.push(interval);
  };
  const createDragBox = (data: any, client: { x: number; y: number }) => {
    if (!document.getElementById(`box-${data.id}`)) {
      runtimeRef.current.pointModalList.forEach((p) => {
        closeDragBox(`box-${p}`);
      });
      runtimeRef.current.pointModalList = [];
      runtimeRef.current.pointIntervalList.forEach((i) => {
        clearRefInterval(i);
      });
      runtimeRef.current.pointIntervalList = [];
      const div = document.createElement('div');
      div.id = `box-${data.id}`;
      document.getElementById('dragBoxArea')?.appendChild(div);
      const DragBox = (
        <DraggableModal
          data={data}
          defaultPosition={client}
          onClose={() => closeDragBox(`box-${data.id}`)}
          saveInterval={saveInterval}
        />
      );
      ReactDOM.render(DragBox, div);
      runtimeRef.current.pointModalList.push(data.id);
    }
  };

  const DrawInnerMap = (roomId: number, roomPicPath: string) => {
    G6.registerNode(
      'breath-node',
      {
        afterDraw(cfg: any, group: any) {
          if (cfg.error) {
            // console.log('cfg', cfg, group);
            const r = cfg.size / 2;
            const back1 = group.addShape('circle', {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.color || (cfg.style && cfg.style.fill),
                opacity: 0.6,
              },
              name: 'back1-shape',
            });
            group.sort(); // 排序，根据zIndex 排序
            const delayBase = Math.random() * 2000;
            back1.animate(
              {
                // 逐渐放大，并消失
                r: r + 10,
                opacity: 0.0,
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: 'easeCubic',
                delay: delayBase, // 无延迟
              },
            );
          }
        },
      },
      'circle',
    );

    const graph = new G6.Graph({
      container: 'container',
      width: 900,
      height: 700,
      // modes: {
      //   default: [
      //     {
      //       type: 'tooltip',
      //       formatText: function formatText(model) {
      //         console.log('model', model);
      //         return `<div>ID: ${model.n ? 'null' : model.id}</div>
      //         <div>位置: (${model.x},${model.y})</div>`;
      //       },
      //       shouldUpdate: (e) => true,
      //     },
      //   ],
      // },
      defaultNode: {
        type: 'breath-node',
        size: 6,
        style: {
          lineWidth: 0,
          // fill: 'rgb(240, 223, 83)',
          fill: '#0BDD8B',
          // cursor: 'pointer',
        },
        labelCfg: {
          position: 'bottom',
          offset: 5,
          style: {
            fill: '#fff',
          },
        },
      },
    });
    DeviceGetRoomOfDeviceList({ roomId }).then((res) => {
      // console.log('p', res);
      if (res?.data) {
        const graphData = res.data.map((d: any) => ({
          id: `${d.deviceId}`,
          name: d.deviceName,
          label: d.deviceName,
          x: d.locateX,
          y: d.locateY,
        }));
        graph.data({ nodes: graphData });
        let usedGraphData = graphData;

        // graph.on('node:click', (e) => {
        //   console.log('e', e, e.item?._cfg?.model);
        //   createDragBox(e.item?._cfg?.model, { x: e.clientX, y: e.clientY });
        // });
        graph.on('click', (e) => {
          // console.log(e.originalEvent)
          // @ts-ignore
          const offsetX = e.originalEvent.offsetX;
          // const offsetX = e.originalEvent.offsetX / runtimeRef.current.zoom;
          // @ts-ignore
          const offsetY = e.originalEvent.offsetY;
          // const offsetY = e.originalEvent.offsetY / runtimeRef.current.zoom;
          const point = graphData.find(
            (data: any) =>
              offsetX >= data.x - 3 &&
              offsetX <= data.x + 3 &&
              offsetY >= data.y - 3 &&
              offsetY <= data.y + 3,
          );
          if (point) {
            createDragBox(point, {
              // @ts-ignore
              x: e.originalEvent.clientX / runtimeRef.current.zoom,
              // @ts-ignore
              y: e.originalEvent.clientY / runtimeRef.current.zoom,
            });
          }
        });
        graph.on('mousemove', (e) => {
          // @ts-ignore
          const offsetX = e.originalEvent.offsetX;
          // const offsetX = e.originalEvent.offsetX / runtimeRef.current.zoom;
          // @ts-ignore
          const offsetY = e.originalEvent.offsetY;
          // const offsetY = e.originalEvent.offsetY / runtimeRef.current.zoom;
          const point = graphData.find(
            (data: any) =>
              offsetX >= data.x - 3 &&
              offsetX <= data.x + 3 &&
              offsetY >= data.y - 3 &&
              offsetY <= data.y + 3,
          );
          if (point) {
            console.log('e', e);
            document.getElementById('container')!.className = styles.pointer;
          } else {
            document.getElementById('container')!.className = '';
          }
        });
        graph.get(
          'container',
        ).style.backgroundImage = `url(${fileUrl}${roomPicPath})`;
        graph.get('container').style.backgroundSize = '900px 700px';
        graph.get('container').style.backgroundRepeat = 'no-repeat';
        setInnerGraph(graph);
        graph.render();

        const getRoomAlarmPoint = () => {
          DeviceGetAlarmOfDevice({ id: roomId }).then((res) => {
            if (res.data) {
              const errorPointList: number[] = res.data;
              const graphDataClone = cloneDeep(usedGraphData);
              graphDataClone.forEach((data: any) => {
                if (data.error) {
                  delete data.error;
                }
                if (data.style) {
                  delete data.style;
                }
              });
              errorPointList.forEach((point) => {
                const errorPointData = graphDataClone.find(
                  (data: any) => data.id === `${point}`,
                );
                if (errorPointData) {
                  errorPointData.error = true;
                  errorPointData.style = { fill: 'red' };
                }
              });
              usedGraphData = graphDataClone;
              graph.data({ nodes: graphDataClone });
              graph.render();
            }
          });
        };
        getRoomAlarmPoint();
        runtimeRef.current.roomAlarmPointInterval = setInterval(
          getRoomAlarmPoint,
          10000,
        );
      }
    });
  };
  const removeInnerMap = () => {
    runtimeRef.current.pointModalList.forEach((p) => {
      closeDragBox(`box-${p}`);
    });
    runtimeRef.current.pointModalList = [];
    runtimeRef.current.pointIntervalList.forEach((i) => {
      clearRefInterval(i);
    });
    runtimeRef.current.pointIntervalList = [];
    innerGraph?.destroy();
    setIsInnerMap({ inner: false, data: null });
    const container = document.getElementById('container');
    if (container) {
      document.getElementById('containerr')?.removeChild(container);
    }
  };

  const getOffsetTop = (obj: any) => {
    let tmp = obj.offsetTop;
    let val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetTop;
      val = val.offsetParent;
    }
    return tmp;
  };
  const getOffsetLeft = (obj: any) => {
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while (val != null) {
      tmp += val.offsetLeft;
      val = val.offsetParent;
    }
    return tmp;
  };
  const mapClick = (e: React.MouseEvent) => {
    const box = document.getElementById('regionalMap');
    const zoom = runtimeRef.current.zoom;
    const offsetWidth = box!.offsetWidth * zoom;
    const offsetHeight = box!.offsetHeight * zoom;
    const offsetX = e.clientX - getOffsetLeft(box) * zoom;
    const offsetY = e.clientY - getOffsetTop(box) * zoom;
    const offsetPerX = offsetX / offsetWidth;
    const offsetPerY = offsetY / offsetHeight;
    // console.log('mapPercentData', mapPercentData)
    // console.log('e', `(${offsetPerX},${offsetPerY})`);

    const clickPoint = mapPercentData.find(
      (data) =>
        offsetPerX >= data.accessX[0] &&
        offsetPerX <= data.accessX[1] &&
        offsetPerY >= data.accessY[0] &&
        offsetPerY <= data.accessY[1],
    );
    if (clickPoint) {
      const clickPointData = mapData.find((data) => data.id === clickPoint.id);
      // console.log('p', clickPoint, clickPointData);
      if (clickPointData.linked === 1 && clickPointData.rooms?.length) {
        const container = document.getElementById('container');
        if (container) {
          document.getElementById('containerr')?.removeChild(container);
        }
        const div = document.createElement('div');
        div.id = 'container';
        document.getElementById('containerr')?.appendChild(div);
        setIsInnerMap({
          inner: true,
          data: {
            pointId: clickPointData.rooms[0].pointId,
            roomId: clickPointData.rooms[0].roomId,
            roomName: clickPointData.rooms[0].roomName,
            roomPicPath: clickPointData.rooms[0].roomPicPath,
          },
        });
        setShowNamePoint(null);
        DrawInnerMap(
          clickPointData.rooms[0].roomId,
          clickPointData.rooms[0].roomPicPath,
        );
      }
    }
  };

  const mapHover = (e: React.MouseEvent) => {
    const box = document.getElementById('regionalMap');
    const zoom = runtimeRef.current.zoom;
    const offsetWidth = box!.offsetWidth * zoom;
    const offsetHeight = box!.offsetHeight * zoom;
    const offsetX = e.clientX - getOffsetLeft(box) * zoom;
    const offsetY = e.clientY - getOffsetTop(box) * zoom;
    const offsetPerX = offsetX / offsetWidth;
    const offsetPerY = offsetY / offsetHeight;

    const hoverPoint = mapPercentData.find(
      (data) =>
        offsetPerX >= data.accessX[0] &&
        offsetPerX <= data.accessX[1] &&
        offsetPerY >= data.accessY[0] &&
        offsetPerY <= data.accessY[1],
    );
    if (hoverPoint) {
      setShowNamePoint(hoverPoint.id);
    } else {
      setShowNamePoint(null);
    }
  };

  // useEffect(() => {
  //   getWeather();
  //   setInterval(getWeather, 3600000);
  //   // runtimeRef.current.scrollTableInterval = setInterval(tableScroll, 2000);
  // }, []);

  return (
    <>
      <Helmet>
        <title>宁波舟山港大屏</title>
        <link rel="shortcut icon" href={logoIcon}></link>
      </Helmet>
      <div className={styles.main} id="main">
        <div
          className={`${styles.loading} ${
            loading ? styles.loadingActive : styles.loadingUnactive
          }`}
        >
          <Spin spinning={loading} size="large" tip="加载中..." />
        </div>
        <div id="dragBoxArea" className={styles.dragBoxArea}></div>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <DateTime />
          </div>
          <div className={styles.topMiddle}>
            <div className={styles.title}>宁波舟山港动环监控平台</div>
          </div>
          <div className={styles.topRight}>
            {/* <div className={styles.weather}>{`${weatherData.city ?? ''}  ${weatherData.temp1 ?? ''
              } - ${weatherData.temp2 ?? ''}  ${weatherData.weather ?? ''}`}</div> */}
            {/* <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=te&skin=pitaya&color=FFFFFF" frameborder="0" width="200" height="24" allowtransparency="true" /> */}
            <img src={logo} className={styles.logo} />
            <div className={styles.runTime}>
              安全运行{` ${runTime ?? ''} `}天
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.bodyLeft}>
            <div className={styles.leftTop}>
              <AnimateBorder />
              <div
                className={styles.content}
                onMouseEnter={() =>
                  clearRefInterval(runtimeRef.current.leftTabsInterval)
                }
                onMouseLeave={startLeftTabsInterval}
              >
                <div className={styles.contentTitle}>设备状态</div>
                <div className={styles.tabs}>
                  <Tabs
                    type="card"
                    className={styles.tab}
                    activeKey={leftActiveKey}
                    onChange={(activeKey) => setLeftActiveKey(activeKey)}
                  >
                    {deviceTypeList.map((type, index) => {
                      const deviceData = deviceSumList.find(
                        (d) => d.type === type,
                      );
                      return (
                        <Tabs.TabPane tab={type} key={`${index}`}>
                          <div className={styles.data}>
                            <div className={styles.dataBlue}>
                              <div className={styles.number}>
                                {deviceData
                                  ? deviceData.normalNum + deviceData.faultNum
                                  : ''}
                              </div>
                              <div className={styles.text}>设备总数</div>
                            </div>
                            <div className={styles.dataGreen}>
                              <div className={styles.number}>
                                {deviceData ? deviceData.normalNum : ''}
                              </div>
                              <div className={styles.text}>设备正常</div>
                            </div>
                            <div className={styles.dataRed}>
                              <div className={styles.number}>
                                {deviceData ? deviceData.faultNum : ''}
                              </div>
                              <div className={styles.text}>设备异常</div>
                            </div>
                          </div>
                        </Tabs.TabPane>
                      );
                    })}
                  </Tabs>
                </div>
              </div>
            </div>
            <div className={styles.leftBottom}>
              <AnimateBorder />
              <div className={styles.content}>
                <div className={styles.titleLine}>
                  <div className={styles.contentTitle}>用电设备</div>
                  <Select
                    className={styles.select}
                    value={leftSelectKey}
                    onChange={(value) => setLeftSelectKey(value)}
                    suffixIcon={
                      <CaretDownOutlined style={{ color: '#66D7F6' }} />
                    }
                  >
                    {mapData.map((data) => (
                      <Select.Option value={data.id} key={data.id}>
                        {data.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.progressArea}>
                  <div>
                    <CircleProgress
                      percent={
                        progressData.commercial &&
                        progressData.commercial.sum !== 0
                          ? Math.floor(
                              (progressData.commercial.normalNum /
                                progressData.commercial.sum) *
                                100,
                            )
                          : 100
                      }
                      percentColor="#72ECFF"
                      text="市电"
                      strokeColor={{
                        '0%': '#72ECFF',
                        // '50%': '#339AFF',
                        '100%': '#339AFF',
                      }}
                      animationType="A"
                    />
                    <StateCard
                      successNum={
                        progressData.commercial
                          ? progressData.commercial.normalNum
                          : 0
                      }
                      errorNum={
                        progressData.commercial
                          ? progressData.commercial.faultNum
                          : 0
                      }
                    />
                  </div>
                  <div>
                    <CircleProgress
                      percent={
                        progressData.ups && progressData.ups.sum !== 0
                          ? Math.floor(
                              (progressData.ups.normalNum /
                                progressData.ups.sum) *
                                100,
                            )
                          : 100
                      }
                      percentColor="#B7A0FF"
                      text="UPS"
                      strokeColor={{
                        '0%': '#9372FF',
                        '100%': '#6C8BE8',
                      }}
                      animationType="B"
                    />
                    <StateCard
                      successNum={
                        progressData.ups ? progressData.ups.normalNum : 0
                      }
                      errorNum={
                        progressData.ups ? progressData.ups.faultNum : 0
                      }
                    />
                  </div>
                  <div>
                    <CircleProgress
                      percent={
                        progressData.airConditioner &&
                        progressData.airConditioner.sum !== 0
                          ? Math.floor(
                              (progressData.airConditioner.normalNum /
                                progressData.airConditioner.sum) *
                                100,
                            )
                          : 100
                      }
                      percentColor="#71A4FF"
                      text="空调"
                      strokeColor={{
                        '0%': '#4A93FF',
                        '100%': '#6AA0FF',
                      }}
                      animationType="C"
                    />
                    <StateCard
                      successNum={
                        progressData.airConditioner
                          ? progressData.airConditioner.normalNum
                          : 0
                      }
                      errorNum={
                        progressData.airConditioner
                          ? progressData.airConditioner.faultNum
                          : 0
                      }
                    />
                  </div>
                </div>
                <div className={styles.titleLine}>
                  <div
                    className={styles.contentTitle}
                    // style={{ marginBottom: 6 }}
                  >
                    用电统计
                  </div>
                  <Radio.Group
                    buttonStyle="solid"
                    value={leftRadioValue}
                    className={styles.radioButton}
                    size="small"
                    onChange={(e) => {
                      setLeftRadioValue(e.target.value);
                      if (leftSelectKey) {
                        MapGetPowerSumList({
                          id: leftSelectKey,
                          type: e.target.value,
                        }).then((res) => {
                          if (res?.data) {
                            setMapPowerSumList(res.data);
                          }
                        });
                      }
                    }}
                  >
                    <Radio.Button value={1}>周</Radio.Button>
                    <Radio.Button value={2}>月</Radio.Button>
                  </Radio.Group>
                </div>
                <div className={styles.mapArea}>
                  <KWHArea
                    data={mapPowerSumList}
                    xField={leftRadioValue === 1 ? 'powerTime' : 'powerMonth'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyMiddle}>
            <div
              className={styles.outerMap}
              style={{ display: isInnerMap.inner ? 'none' : 'flex' }}
            >
              <MapHeader data={deviceIndexNum} />
              <div
                className={styles.regionalMap}
                id="regionalMap"
                onClick={mapClick}
                onMouseMove={mapHover}
              >
                <FlylineMap
                  data={mapData}
                  errorPoints={deviceAlarmPointData}
                  showNamePoint={showNamePoint}
                />
              </div>
              <MapLegend />
            </div>
            <div
              className={styles.innerMap}
              id="containerr"
              style={{ display: isInnerMap.inner ? 'block' : 'none' }}
            >
              <div className={styles.roomName}>{isInnerMap.data?.roomName}</div>
              <LeftCircleOutlined
                className={styles.backIcon}
                onClick={removeInnerMap}
                title="返回"
              />
            </div>
            <div
              className={styles.middleBottom}
              style={{ height: bottomBoxUp ? 600 : 220 }}
            >
              <AnimateBorder />
              <div className={styles.content}>
                <div className={styles.titleLine}>
                  <div className={styles.contentTitle}>实时告警</div>
                  {bottomBoxUp ? (
                    <CaretDownOutlined
                      className={styles.caretIcon}
                      onClick={() => setBottomBoxUp(false)}
                    />
                  ) : (
                    <CaretUpOutlined
                      className={styles.caretIcon}
                      onClick={() => setBottomBoxUp(true)}
                    />
                  )}
                </div>
                <div
                  className={styles.scrollTable}
                  // onWheel={(e) => {
                  //   if (e.nativeEvent.deltaY > 0) {
                  //     scrollRef && scrollRef.slickNext();
                  //   } else if (e.nativeEvent.deltaY < 0) {
                  //     scrollRef && scrollRef.slickPrev();
                  //   }
                  // }}
                  // onMouseEnter={() => {
                  //   clearRefInterval(runtimeRef.current.scrollTableInterval);
                  //   setScrollPause(true);
                  // }}
                  // onMouseLeave={() => {
                  //   runtimeRef.current.scrollTableInterval = setInterval(
                  //     tableScroll,
                  //     2000,
                  //   );
                  //   setScrollPause(false);
                  // }}
                >
                  {/* <ScrollTable
                    data={bottomData}
                    slidesToShow={
                      bottomBoxUp ? getScrollLimit(12) : getScrollLimit(3)
                    }
                    scrollPause={scrollPause}
                  /> */}
                  <AlarmTable
                    data={alarmEventLatest}
                    bottomBoxUp={bottomBoxUp}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyRight}>
            <div className={styles.rightTop}>
              <AnimateBorder />
              <div
                className={styles.content}
                onMouseEnter={() =>
                  clearRefInterval(runtimeRef.current.rightTabsInterval)
                }
                onMouseLeave={startRightTabsInterval}
              >
                <div className={styles.contentTitle}>温湿度</div>
                <div className={styles.tabs}>
                  {deviceThiData.length > 1 ? (
                    <Tabs
                      type="card"
                      className={`${styles.tab} ${styles.wrapTab}`}
                      activeKey={rightActiveKey}
                      onChange={(activeKey) => setRightActiveKey(activeKey)}
                    >
                      {deviceThiData.map((data) => (
                        <Tabs.TabPane tab={data.groupName} key={data.groupKey}>
                          <THTable data={data.groupData} />
                        </Tabs.TabPane>
                      ))}
                    </Tabs>
                  ) : deviceThiData.length === 1 ? (
                    <div style={{ marginBottom: 42 }}>
                      <THTable data={deviceThiData[0].groupData} />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
            <div className={styles.rightBottom}>
              <AnimateBorder />
              <div className={styles.content}>
                <div className={styles.titleLine}>
                  <div className={styles.contentTitle}>告警统计</div>
                  <Radio.Group
                    buttonStyle="solid"
                    value={rightRadioValue}
                    className={styles.radioButton}
                    size="small"
                    onChange={(e) => {
                      setRightRadioValue(e.target.value);
                      AlarmEventGetSumList({ type: e.target.value }).then(
                        (res) => {
                          if (res?.data) {
                            setAlarmEventSumList(res.data);
                          }
                        },
                      );
                    }}
                  >
                    <Radio.Button value={1}>周</Radio.Button>
                    <Radio.Button value={2}>月</Radio.Button>
                  </Radio.Group>
                </div>
                <div className={styles.historyArea}>
                  <HistoryDualAxes
                    data={alarmEventSumList}
                    xField={rightRadioValue === 1 ? 'alarmTime' : 'alarmMonth'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
