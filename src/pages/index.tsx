import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Helmet } from 'umi';
import { Select, Tabs } from 'antd';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  LeftCircleOutlined,
} from '@ant-design/icons';
import G6, { Graph } from '@antv/g6';
import {
  AlarmEventGetLatest,
  AlarmEventGetSumList,
  DeviceGetAlarmOfPoint,
  DeviceGetIndexNum,
  DeviceGetPowerOfDevice,
  DeviceGetSumList,
  DeviceGetTypeList,
  DeviceThi,
  MapGetPowerSumList,
  MapPointList,
} from '@/services/api';
// import ScrollTable, { scrollRef } from './components/ScrollTable';
import StateCard from './components/StateCard';
import HistoryDualAxes from './components/HistoryDualAxes';
import FlylineChart from './components/FlylineChart';
import DateTime from './components/DateTime';
import AlarmTable from './components/AlarmTable';
import THTable, { THTableRow } from './components/THTable';
import KWHArea from './components/KWHArea';
import MapHeader, { DeviceIndexNumType } from './components/MapHeader';
import CircleProgress from './components/CircleProgress';
// @ts-ignore
import logo from '@/assets/logo.ico';
import styles from './index.less';
import a from '@/assets/a.png';

interface RuntimeRefType {
  leftTabsInterval: NodeJS.Timer | null;
  leftSelectInterval: NodeJS.Timer | null;
  // scrollTableInterval: NodeJS.Timer | null;
  rightTabsInterval: NodeJS.Timer | null;
  mapAlarmPointInterval: NodeJS.Timer | null;
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

const leftAreaData = [
  { type: '市电', month: '5', percent: 20 },
  { type: '市电', month: '6', percent: 30 },
  { type: '市电', month: '7', percent: 50 },
  { type: '市电', month: '8', percent: 40 },
  { type: '市电', month: '9', percent: 60 },
  { type: '市电', month: '10', percent: 70 },
  { type: '市电', month: '11', percent: 20 },
  { type: '市电', month: '12', percent: 30 },
  { type: '市电', month: '1', percent: 50 },
  { type: '市电', month: '2', percent: 40 },
  { type: '市电', month: '3', percent: 60 },
  { type: '市电', month: '4', percent: 70 },
  { type: 'UPS', month: '5', percent: 50 },
  { type: 'UPS', month: '6', percent: 30 },
  { type: 'UPS', month: '7', percent: 30 },
  { type: 'UPS', month: '8', percent: 20 },
  { type: 'UPS', month: '9', percent: 10 },
  { type: 'UPS', month: '10', percent: 30 },
  { type: 'UPS', month: '11', percent: 50 },
  { type: 'UPS', month: '12', percent: 30 },
  { type: 'UPS', month: '1', percent: 30 },
  { type: 'UPS', month: '2', percent: 20 },
  { type: 'UPS', month: '3', percent: 10 },
  { type: 'UPS', month: '4', percent: 30 },
  { type: '空调', month: '5', percent: 30 },
  { type: '空调', month: '6', percent: 20 },
  { type: '空调', month: '7', percent: 40 },
  { type: '空调', month: '8', percent: 70 },
  { type: '空调', month: '9', percent: 60 },
  { type: '空调', month: '10', percent: 20 },
  { type: '空调', month: '11', percent: 30 },
  { type: '空调', month: '12', percent: 20 },
  { type: '空调', month: '1', percent: 40 },
  { type: '空调', month: '2', percent: 70 },
  { type: '空调', month: '3', percent: 60 },
  { type: '空调', month: '4', percent: 20 },
];

const n = [
  {
    id: '0',
    x: 237.12947577405964,
    y: 240.95782980909365,
    error: true,
    style: { fill: 'red' },
  },
  { id: '1', x: 278.3592007497872, y: 336.54688051795773, error: false },
  { id: '2', x: 278.3592007497872, y: 336.54688051795773, error: false },
  { id: '3', x: 256.1948574264118, y: 111.97476803836841, error: false },
  { id: '4', x: 170.2285476653881, y: 366.2158066640094, error: false },
];

const IndexPage: React.FC = () => {
  const [leftActiveKey, setLeftActiveKey] = useState<string>('0');
  const [rightActiveKey, setRightActiveKey] = useState<string>('0');
  const [leftSelectKey, setLeftSelectKey] = useState<number | null>(null);
  const [bottomBoxUp, setBottomBoxUp] = useState<boolean>(false);
  // const [scrollPause, setScrollPause] = useState<boolean>(false);
  const [isInnerMap, setIsInnerMap] = useState<boolean>(false);
  const [innerGraph, setInnerGraph] = useState<Graph | null>(null);
  const [weatherData, setWeatherData] = useState<any>({});
  const [mapData, setMapData] = useState<any[]>([]);
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
  const [deviceThiData, setDeviceThiData] = useState<any[]>([]);
  const runtimeRef = useRef<RuntimeRefType>({
    leftTabsInterval: null,
    leftSelectInterval: null,
    // scrollTableInterval: null,
    rightTabsInterval: null,
    mapAlarmPointInterval: null,
  });

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
    // @ts-ignore
    document.getElementById('main')!.style.zoom = `${
      document.body.clientWidth / 1920
    }`;
  }, [document.body.clientWidth]);

  useEffect(() => {
    MapPointList().then((res) => {
      if (res?.data) {
        setMapData(res.data);
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
    AlarmEventGetSumList().then((res) => {
      if (res?.data) {
        setAlarmEventSumList(res.data);
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
          // setRightTopData(rtData);
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
      MapGetPowerSumList({ id: leftSelectKey }).then((res) => {
        console.log('res', res);
      });
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
    if (isInnerMap) {
      clearRefInterval(runtimeRef.current.mapAlarmPointInterval);
    } else {
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
  }, [isInnerMap]);

  const getWeather = () => {
    const cityCode = '101210401';
    const url = `/weather/data/cityinfo/${cityCode}.html`;
    // const url = `/weather/data/sk/${cityCode}.html`;
    fetch(url).then((res) => {
      // console.log('res', res)
      res.json().then((resJson) => {
        console.log('resJson', resJson);
        setWeatherData(resJson?.weatherinfo ?? {});
      });
    });
  };

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

  const DrawInnerMap = () => {
    G6.registerNode(
      'breath-node',
      {
        afterDraw(cfg: any, group: any) {
          if (cfg.error) {
            console.log('cfg', cfg, group);
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
      modes: {
        default: [
          {
            type: 'tooltip',
            formatText: function formatText(model) {
              console.log('model', model);
              return `<div>ID: ${model.id}</div>
              <div>位置: (${model.x},${model.y})</div>`;
            },
            shouldUpdate: (e) => true,
          },
        ],
      },
      defaultNode: {
        type: 'breath-node',
        size: 5,
        style: {
          lineWidth: 0,
          fill: 'rgb(240, 223, 83)',
        },
      },
    });
    graph.data({ nodes: n });
    // fetch('https://gw.alipayobjects.com/os/basement_prod/8c2353b0-99a9-4a93-a5e1-3e7df1eac64f.json')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const nodes = data.nodes;
    //     // const classMap = new Map();
    //     // let classId = 0;
    //     nodes.forEach(function (node) {
    //       node.y = -node.y;
    //     });
    //     scaleNodesPoints(nodes, graphSize);
    //     console.log('data', data)
    //     // graph.data(data);
    //     graph.data({ nodes: n })
    //     graph.render();
    //   });

    graph.on('node:click', (e) => console.log('e', e));

    graph.get('container').style.backgroundImage = `url(${a})`;
    // graph.get('container').style.backgroundImage = 'url("https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*G23iRqkiibIAAAAAAAAAAABkARQnAQ")';
    graph.get('container').style.backgroundSize = '900px 700px';
    graph.get('container').style.backgroundRepeat = 'no-repeat';
    setInnerGraph(graph);
    graph.render();
  };
  const removeInnerMap = () => {
    innerGraph?.destroy();
    setIsInnerMap(false);
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
    const clientX = e.clientX;
    const clientY = e.clientY;
    const offsetX = e.clientX - getOffsetLeft(box);
    const offsetY = e.clientY - getOffsetTop(box);
    const offsetPerX = offsetX / box!.offsetWidth;
    const offsetPerY = offsetY / box!.offsetHeight;
    console.log(
      'e',
      `(${clientX},${clientY})`,
      `(${offsetX},${offsetY})`,
      `${offsetPerX},${offsetPerY}`,
    );
    const div = document.createElement('div');
    div.id = 'container';
    document.getElementById('containerr')?.appendChild(div);
    setIsInnerMap(true);
    DrawInnerMap();
  };

  useEffect(() => {
    getWeather();
    setInterval(getWeather, 3600000);
    // runtimeRef.current.scrollTableInterval = setInterval(tableScroll, 2000);
  }, []);

  return (
    <>
      <Helmet>
        <title>宁波港大屏</title>
      </Helmet>
      <div className={styles.main} id="main">
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <DateTime />
          </div>
          <div className={styles.topMiddle}>
            <div className={styles.title}>宁波舟山港动环监控平台</div>
          </div>
          <div className={styles.topRight}>
            <div className={styles.weather}>{`${weatherData.city ?? ''}  ${
              weatherData.temp1 ?? ''
            } - ${weatherData.temp2 ?? ''}  ${weatherData.weather ?? ''}`}</div>
            <img src={logo} className={styles.logo} />
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.bodyLeft}>
            <div className={styles.leftTop}>
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
                              <div className={styles.text}>接入设备总数</div>
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
              <div className={styles.content}>
                <div className={styles.titleLine}>
                  <div className={styles.contentTitle}>用电统计</div>
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
                <div className={styles.mapArea}>
                  <KWHArea data={leftAreaData} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyMiddle}>
            <div
              className={styles.outerMap}
              style={{ display: isInnerMap ? 'none' : 'flex' }}
            >
              <MapHeader data={deviceIndexNum} />
              <div
                className={styles.regionalMap}
                id="regionalMap"
                onClick={mapClick}
              >
                <FlylineChart
                  data={mapData}
                  errorPoints={deviceAlarmPointData}
                />
              </div>
            </div>
            <div
              className={styles.innerMap}
              id="containerr"
              style={{ display: isInnerMap ? 'block' : 'none' }}
            >
              <div
                style={{
                  color: '#fff',
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  fontSize: 28,
                  fontWeight: 'bold',
                }}
              >
                机房名称
              </div>
              <LeftCircleOutlined
                style={{
                  color: '#fff',
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  padding: 3,
                  fontSize: 18,
                }}
                onClick={removeInnerMap}
                title="返回"
              />
            </div>
            <div
              className={styles.middleBottom}
              style={{ height: bottomBoxUp ? 600 : 220 }}
            >
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
              <div
                className={styles.content}
                onMouseEnter={() =>
                  clearRefInterval(runtimeRef.current.rightTabsInterval)
                }
                onMouseLeave={startRightTabsInterval}
              >
                <div className={styles.contentTitle}>温湿度</div>
                <div className={styles.tabs}>
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
                </div>
              </div>
            </div>
            <div className={styles.rightBottom}>
              <div className={styles.content}>
                <div className={styles.contentTitle}>历史告警统计</div>
                <div className={styles.historyArea}>
                  <HistoryDualAxes data={alarmEventSumList} />
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
