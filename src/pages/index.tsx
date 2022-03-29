import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Helmet } from 'umi';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Progress, Select, Table, Tabs } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
// import { Scene, LineLayer, PointLayer } from '@antv/l7';
// import { Mapbox, GaodeMap } from '@antv/l7-maps';
import G6 from '@antv/g6';
import ScrollTable, { scrollRef } from './components/ScrollTable';
import StateCard from './components/StateCard';
// @ts-ignore
import logo from '@/assets/logo.ico';
import styles from './index.less';

interface runtimeRefType {
  leftTabsInterval: NodeJS.Timer | null;
  scrollTableInterval: NodeJS.Timer | null;
}

const leftSelectData = [
  {
    key: '1',
    name: '点位一',
  },
  {
    key: '2',
    name: '点位二',
  },
  {
    key: '3',
    name: '点位三',
  },
];
const leftAreaData = [
  { type: '市电', month: '1月', percent: 50 },
  { type: '市电', month: '2月', percent: 40 },
  { type: '市电', month: '3月', percent: 60 },
  { type: '市电', month: '4月', percent: 70 },
  { type: '市电', month: '5月', percent: 20 },
  { type: '市电', month: '6月', percent: 30 },
  { type: 'UPS', month: '1月', percent: 30 },
  { type: 'UPS', month: '2月', percent: 20 },
  { type: 'UPS', month: '3月', percent: 10 },
  { type: 'UPS', month: '4月', percent: 30 },
  { type: 'UPS', month: '5月', percent: 50 },
  { type: 'UPS', month: '6月', percent: 30 },
  { type: '空调', month: '1月', percent: 40 },
  { type: '空调', month: '2月', percent: 70 },
  { type: '空调', month: '3月', percent: 60 },
  { type: '空调', month: '4月', percent: 20 },
  { type: '空调', month: '5月', percent: 30 },
  { type: '空调', month: '6月', percent: 20 },
];
// const mapData = `"start station latitude","start station longitude","end station latitude","end station longitude"
// 29.877092,121.568418,29.916719,121.855605
// 29.926684,121.871374,29.916719,121.855605
// 29.926382,121.94271,29.916719,121.855605
// 29.891641,122.0536,29.916719,121.855605`;
// const testPoints = `"start station latitude","start station longitude"
// 29.916719,121.855605
// 29.877092,121.568418
// 29.926684,121.871374
// 29.926382,121.94271
// 29.891641,122.0536`

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
const bottomData = [
  {
    id: '1',
    name: '设备1',
    address: '1号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '1',
  },
  {
    id: '2',
    name: '设备2',
    address: '1号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '1',
  },
  {
    id: '3',
    name: '设备3',
    address: '1号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '1',
  },
  {
    id: '4',
    name: '设备4',
    address: '2号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '2',
  },
  {
    id: '5',
    name: '设备5',
    address: '2号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '2',
  },
  {
    id: '6',
    name: '设备6',
    address: '2号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '2',
  },
  {
    id: '7',
    name: '设备7',
    address: '3号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '3',
  },
  {
    id: '8',
    name: '设备8',
    address: '3号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '3',
  },
  {
    id: '9',
    name: '设备9',
    address: '3号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '3',
  },
  {
    id: '10',
    name: '设备10',
    address: '4号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '4',
  },
  {
    id: '11',
    name: '设备11',
    address: '4号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '4',
  },
  {
    id: '12',
    name: '设备12',
    address: '4号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '4',
  },
  {
    id: '13',
    name: '设备13',
    address: '5号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '5',
  },
  {
    id: '14',
    name: '设备14',
    address: '5号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '5',
  },
  {
    id: '15',
    name: '设备15',
    address: '5号机房',
    content: '内容',
    dateTime: '2022-03-28 15:00:00',
    state: '5',
  },
];

const IndexPage: React.FC = () => {
  const [dateTime, setDateTime] = useState<string>('');
  const [leftActiveKey, setLeftActiveKey] = useState<string>('1');
  const [leftSelectKey, setLeftSelectKey] = useState<string>('1');
  const [bottomBoxUp, setBottomBoxUp] = useState<boolean>(false);
  const [scrollPause, setScrollPause] = useState<boolean>(false);
  const runtimeRef = useRef<runtimeRefType>({
    leftTabsInterval: null,
    scrollTableInterval: null,
  });

  // const columns = [
  //   {
  //     title: '设备',
  //     dataIndex: 'name',
  //     render: (_: any, record: any) => (<div className='td'>{record.name}</div>),
  //   },
  //   {
  //     title: '所在机房',
  //     dataIndex: 'address',
  //     render: (_: any, record: any) => (<div className='td'>{record.address}</div>),
  //   },
  //   {
  //     title: '内容',
  //     dataIndex: 'content',
  //     render: (_: any, record: any) => (<div className='td'>{record.content}</div>),
  //   },
  //   {
  //     title: '时间',
  //     dataIndex: 'dateTime',
  //     render: (_: any, record: any) => (<div className='td'>{record.dateTime}</div>),
  //   },
  //   {
  //     title: '事件级别',
  //     dataIndex: 'state',
  //     render: (_: any, record: any) => (<div className='td'>{record.state}</div>),
  //   },
  // ];

  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   fetch('https://gw.alipayobjects.com/os/bmw-prod/b21e7336-0b3e-486c-9070-612ede49284e.json')
  //     .then((response) => response.json())
  //     .then((json) => { console.log('data', json); setData(json) })
  //     .catch((error) => {
  //       console.log('fetch data failed', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   const cityCode = '101210401';
  //   const url = `/weather/data/cityinfo/${cityCode}.html`
  //   fetch(url).then(res => {
  //     // console.log('res', res)
  //     res.json().then(resJson => {
  //       console.log('resJson', resJson)
  //     })
  //   })
  // }, []);
  const changeLeftTab = () => {
    setLeftActiveKey((activeKey) => {
      if (activeKey === '1') {
        return '2';
      } else if (activeKey === '2') {
        return '3';
      } else if (activeKey === '3') {
        return '4';
      } else if (activeKey === '4') {
        return '1';
      } else {
        return '1';
      }
    });
  };
  const tableScroll = () => {
    scrollRef && scrollRef.slickNext();
  };
  const clearRefInterval = (interval: NodeJS.Timer | null) => {
    if (interval) {
      clearInterval(interval);
    }
  };

  const getScrollLimit = (maxCount: number) => {
    if (bottomData.length >= maxCount) {
      return maxCount;
    } else {
      return bottomData.length;
    }
  };

  useEffect(() => {
    setInterval(() => {
      setDateTime(moment().format('HH:mm:ss\xa0\xa0YYYY年M月D日\xa0\xa0dddd'));
    }, 1000);
    runtimeRef.current.leftTabsInterval = setInterval(changeLeftTab, 2000);
    runtimeRef.current.scrollTableInterval = setInterval(tableScroll, 2000);
  }, []);

  // useLayoutEffect(() => {
  //   const scene = new Scene({
  //     id: 'amap',
  //     map: new Mapbox({
  //       pitch: 45,
  //       type: 'mapbox',
  //       style: 'light',
  //       center: [121.855605, 29.916719],
  //       zoom: 10,
  //       stencil: true
  //     })
  //     // map: new GaodeMap({
  //     //   style: 'dark', // 样式URL
  //     //   center: [121.855605, 29.916719],
  //     //   // center: [-74.06967, 40.720399],
  //     //   pitch: 30,
  //     //   zoom: 10,
  //     //   token: '8d061d84f0f5aa06e467f33c2153dedf',
  //     // })
  //   });
  //   scene.on('loaded', () => {
  //     const pointLayer = new PointLayer()
  //       .source(testPoints, {
  //         parser: {
  //           type: 'csv',
  //           x: 'start station longitude',
  //           y: 'start station latitude',
  //         }
  //       })
  //       .animate(true)
  //       .size(30)
  //       .shape('circle')
  //       .color('red')
  //       .on('click', (e) => console.log('e', e))
  //     const lineLayer = new LineLayer({})
  //       .source(mapData, {
  //         parser: {
  //           type: 'csv',
  //           x: 'start station longitude',
  //           y: 'start station latitude',
  //           x1: 'end station longitude',
  //           y1: 'end station latitude'
  //         }
  //       })
  //       .size(1)
  //       .shape('arc3d')
  //       .color('#0C47BF')
  //       .style({
  //         opacity: 1,
  //         blur: 0.9,
  //       });
  //     scene.addLayer(pointLayer);
  //     scene.addLayer(lineLayer);
  //     // fetch(
  //     //   'https://gw.alipayobjects.com/os/basement_prod/bd33a685-a17e-4686-bc79-b0e6a89fd950.csv'
  //     // )
  //     //   .then(res => res.text())
  //     //   .then(data => {
  //     //     console.log(data, typeof (data))
  //     //     const layer = new LineLayer({})
  //     //       .source(data, {
  //     //         parser: {
  //     //           type: 'csv',
  //     //           x: 'start station longitude',
  //     //           y: 'start station latitude',
  //     //           x1: 'end station longitude',
  //     //           y1: 'end station latitude'
  //     //         }
  //     //       })
  //     //       .size(1)
  //     //       .shape('arc3d')
  //     //       .color('#0C47BF')
  //     //       .style({
  //     //         opacity: 1,
  //     //         blur: 0.9
  //     //       });
  //     //     scene.addLayer(layer);
  //     //   });
  //   });
  // }, []);

  useLayoutEffect(() => {
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
      width: 500,
      height: 500,
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
    graph.render();
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

    graph.get('container').style.backgroundImage =
      'url("https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*G23iRqkiibIAAAAAAAAAAABkARQnAQ")';
    graph.get('container').style.backgroundSize = '500px 500px';
    graph.get('container').style.backgroundRepeat = 'no-repeat';
  }, []);

  return (
    <>
      <Helmet>
        <title>宁波港大屏</title>
      </Helmet>
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <div className={styles.dateTime}>{dateTime}</div>
          </div>
          <div className={styles.topMiddle}>
            <div className={styles.title}>宁波港动环监控平台</div>
          </div>
          <div className={styles.topRight}>
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
                onMouseLeave={() =>
                  (runtimeRef.current.leftTabsInterval = setInterval(
                    changeLeftTab,
                    2000,
                  ))
                }
              >
                <div className={styles.contentTitle}>用电状态</div>
                <div className={styles.tabs}>
                  <Tabs
                    type="card"
                    className={styles.tab}
                    activeKey={leftActiveKey}
                    onChange={(activeKey) => setLeftActiveKey(activeKey)}
                  >
                    <Tabs.TabPane tab="温湿度" key="1"></Tabs.TabPane>
                    <Tabs.TabPane tab="消防" key="2"></Tabs.TabPane>
                    <Tabs.TabPane tab="漏水" key="3"></Tabs.TabPane>
                    <Tabs.TabPane tab="门禁" key="4"></Tabs.TabPane>
                  </Tabs>
                </div>
                <div className={styles.data}>
                  <div className={styles.dataBlue}>
                    <div className={styles.number}>239</div>
                    <div className={styles.text}>接入设备总数</div>
                  </div>
                  <div className={styles.dataGreen}>
                    <div className={styles.number}>238</div>
                    <div className={styles.text}>设备正常</div>
                  </div>
                  <div className={styles.dataRed}>
                    <div className={styles.number}>1</div>
                    <div className={styles.text}>设备异常</div>
                  </div>
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
                    {leftSelectData.map((data) => (
                      <Select.Option value={data.key} key={data.key}>
                        {data.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.progressArea}>
                  <div>
                    <Progress
                      className={styles.progress}
                      type="circle"
                      trailColor="#3A4A6D"
                      percent={99}
                      format={(percent) => (
                        <div className={styles.progressText}>
                          <div
                            className={styles.percent}
                            style={{ color: '#72ECFF' }}
                          >
                            {percent}%
                          </div>
                          <div className={styles.itemName}>市电</div>
                        </div>
                      )}
                      strokeColor={{
                        '0%': '#72ECFF',
                        // '50%': '#339AFF',
                        '100%': '#339AFF',
                      }}
                    />
                    <StateCard successNum={16} errorNum={0} />
                  </div>
                  <div>
                    <Progress
                      className={styles.progress}
                      type="circle"
                      trailColor="#3A4A6D"
                      percent={99}
                      format={(percent) => (
                        <div className={styles.progressText}>
                          <div
                            className={styles.percent}
                            style={{ color: '#B7A0FF' }}
                          >
                            {percent}%
                          </div>
                          <div className={styles.itemName}>UPS</div>
                        </div>
                      )}
                      strokeColor={{
                        '0%': '#9372FF',
                        '100%': '#6C8BE8',
                      }}
                    />
                    <StateCard successNum={16} errorNum={0} />
                  </div>
                  <div>
                    <Progress
                      className={styles.progress}
                      type="circle"
                      trailColor="#3A4A6D"
                      percent={99}
                      format={(percent) => (
                        <div className={styles.progressText}>
                          <div
                            className={styles.percent}
                            style={{ color: '#71A4FF' }}
                          >
                            {percent}%
                          </div>
                          <div className={styles.itemName}>空调</div>
                        </div>
                      )}
                      strokeColor={{
                        '0%': '#4A93FF',
                        '100%': '#6AA0FF',
                      }}
                    />
                    <StateCard successNum={16} errorNum={0} />
                  </div>
                </div>
                <div className={styles.mapArea}>
                  <Area
                    data={leftAreaData}
                    xField="month"
                    yField="percent"
                    seriesField="type"
                    xAxis={{
                      label: {
                        offsetX: 10,
                        rotate: 45,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyMiddle}>
            <div className={styles.innerMap} id="container"></div>
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
                  onWheel={(e) => {
                    if (e.nativeEvent.deltaY > 0) {
                      scrollRef && scrollRef.slickNext();
                    } else if (e.nativeEvent.deltaY < 0) {
                      scrollRef && scrollRef.slickPrev();
                    }
                  }}
                  onMouseEnter={() => {
                    clearRefInterval(runtimeRef.current.scrollTableInterval);
                    setScrollPause(true);
                  }}
                  onMouseLeave={() => {
                    runtimeRef.current.scrollTableInterval = setInterval(
                      tableScroll,
                      2000,
                    );
                    setScrollPause(false);
                  }}
                >
                  <ScrollTable
                    data={bottomData}
                    slidesToShow={
                      bottomBoxUp ? getScrollLimit(10) : getScrollLimit(2)
                    }
                    scrollPause={scrollPause}
                  />
                  {/* <Table
                    columns={columns}
                    dataSource={bottomData}
                    pagination={false}
                    scroll={{ y: 200 }}
                    className={styles.dataTable}
                  /> */}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyRight}>
            <div className={styles.rightTop}>
              <div className={styles.content}>
                <div className={styles.contentTitle}>温湿度</div>
              </div>
            </div>
            <div className={styles.rightBottom}>
              <div className={styles.content}>
                <div className={styles.contentTitle}>历史告警统计</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
