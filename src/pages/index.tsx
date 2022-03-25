import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'umi';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Progress, Select, Tabs } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
// @ts-ignore
import logo from '@/assets/logo.ico';
import styles from './index.less';

interface runtimeRefType {
  leftTabsInterval: NodeJS.Timer | null;
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
  }
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

const IndexPage: React.FC = () => {
  const [dateTime, setDateTime] = useState<string>('');
  const [leftActiveKey, setLeftActiveKey] = useState<string>('1');
  const [leftSelectKey, setLeftSelectKey] = useState<string>('1');
  const runtimeRef = useRef<runtimeRefType>({ leftTabsInterval: null });

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/b21e7336-0b3e-486c-9070-612ede49284e.json')
      .then((response) => response.json())
      .then((json) => { console.log('data', json); setData(json) })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  }, []);

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
    setLeftActiveKey(activeKey => {
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
    })
  }
  const clearRefInterval = (interval: NodeJS.Timer | null) => {
    if (interval) {
      clearInterval(interval);
    }
  }

  useEffect(() => {
    setInterval(() => {
      setDateTime(moment().format('HH:mm:ss\xa0\xa0YYYY年M月D日\xa0\xa0dddd'));
    }, 1000);
    runtimeRef.current.leftTabsInterval = setInterval(changeLeftTab, 1000);
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
                onMouseEnter={() => clearRefInterval(runtimeRef.current.leftTabsInterval)}
                onMouseLeave={() => runtimeRef.current.leftTabsInterval = setInterval(changeLeftTab, 1000)}
              >
                <div className={styles.contentTitle}>用电状态</div>
                <div className={styles.tabs}>
                  <Tabs
                    type='card'
                    className={styles.tab}
                    activeKey={leftActiveKey}
                    onChange={activeKey => setLeftActiveKey(activeKey)}
                  >
                    <Tabs.TabPane tab='温湿度' key='1'></Tabs.TabPane>
                    <Tabs.TabPane tab='消防' key='2'></Tabs.TabPane>
                    <Tabs.TabPane tab='漏水' key='3'></Tabs.TabPane>
                    <Tabs.TabPane tab='门禁' key='4'></Tabs.TabPane>
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
                    suffixIcon={<CaretDownOutlined style={{ color: '#66D7F6' }} />}
                  >
                    {leftSelectData.map((data) => (
                      <Select.Option value={data.key} key={data.key}>{data.name}</Select.Option>
                    ))}
                  </Select>
                </div>
                <div className={styles.progressArea}>
                  <Progress
                    className={styles.progress}
                    type='circle'
                    trailColor='#3A4A6D'
                    percent={99}
                    format={(percent) => (
                      <div className={styles.progressText}>
                        <div className={styles.percent} style={{ color: '#72ECFF' }}>{percent}%</div>
                        <div className={styles.itemName}>市电</div>
                      </div>
                    )}
                    strokeColor={{
                      '0%': '#72ECFF',
                      // '50%': '#339AFF',
                      '100%': '#339AFF',
                    }}
                  />
                  <Progress
                    className={styles.progress}
                    type='circle'
                    trailColor='#3A4A6D'
                    percent={99}
                    format={(percent) => (
                      <div className={styles.progressText}>
                        <div className={styles.percent} style={{ color: '#B7A0FF' }}>{percent}%</div>
                        <div className={styles.itemName}>UPS</div>
                      </div>
                    )}
                    strokeColor={{
                      '0%': '#9372FF',
                      '100%': '#6C8BE8',
                    }}
                  />
                  <Progress
                    className={styles.progress}
                    type='circle'
                    trailColor='#3A4A6D'
                    percent={99}
                    format={(percent) => (
                      <div className={styles.progressText}>
                        <div className={styles.percent} style={{ color: '#71A4FF' }}>{percent}%</div>
                        <div className={styles.itemName}>空调</div>
                      </div>
                    )}
                    strokeColor={{
                      '0%': '#4A93FF',
                      '100%': '#6AA0FF',
                    }}
                  />
                </div>
                <div className={styles.mapArea}>
                  <Area
                    data={leftAreaData}
                    xField='month'
                    yField='percent'
                    seriesField='type'
                    xAxis={{
                      label: {
                        offsetX: 10,
                        rotate: 45,
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bodyMiddle}></div>
          <div className={styles.bodyRight}></div>
        </div>
      </div>
    </>
  );
}

export default IndexPage;
