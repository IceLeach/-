import React from 'react';
import { Empty, Table } from 'antd';
import StateTag from '../StateTag';
import styles from './index.less';

interface AlarmTableProps {
  data: any[];
  bottomBoxUp: boolean;
}

const AlarmTable: React.FC<AlarmTableProps> = (props) => {
  const { data, bottomBoxUp } = props;

  const columns = [
    {
      title: '设备',
      dataIndex: 'deviceName',
      render: (_: any, record: any) => (
        <div className="td">{record.deviceName}</div>
      ),
    },
    {
      title: '所在机房',
      dataIndex: 'roomName',
      render: (_: any, record: any) => (
        <div className="td">{record.roomName}</div>
      ),
    },
    {
      title: '内容',
      dataIndex: 'content',
      render: (_: any, record: any) => (
        <div className="td">{record.content}</div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'startTime',
      render: (_: any, record: any) => (
        <div className="td">{record.startTime}</div>
      ),
    },
    {
      title: '事件级别',
      dataIndex: 'level',
      render: (_: any, record: any) => (
        <div className="td">
          <StateTag text={`${record.level}级`} state={parseInt(record.level)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无告警" />
        ),
      }}
      rowKey="id"
      scroll={{ y: bottomBoxUp ? 470 : 1000 }}
      className={styles.dataTable}
    />
  );
};

export default React.memo(AlarmTable);
