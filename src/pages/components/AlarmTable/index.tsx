import React from 'react';
import { Table } from 'antd';
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
      dataIndex: 'name',
      render: (_: any, record: any) => <div className="td">{record.name}</div>,
    },
    {
      title: '所在机房',
      dataIndex: 'address',
      render: (_: any, record: any) => (
        <div className="td">{record.address}</div>
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
      dataIndex: 'dateTime',
      render: (_: any, record: any) => (
        <div className="td">{record.dateTime}</div>
      ),
    },
    {
      title: '事件级别',
      dataIndex: 'state',
      render: (_: any, record: any) => <div className="td">{record.state}</div>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      scroll={{ y: bottomBoxUp ? 470 : 95 }}
      className={styles.dataTable}
    />
  );
};

export default React.memo(AlarmTable);
