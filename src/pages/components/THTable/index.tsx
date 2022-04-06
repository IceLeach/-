import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

export interface THTableRow {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
}

interface THTableProps {
  data: THTableRow[];
}

const THTable: React.FC<THTableProps> = (props) => {
  const { data } = props;
  // console.log('data', data);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '温度(℃)',
      dataIndex: 'temperature',
    },
    {
      title: '湿度(%RH)',
      dataIndex: 'humidity',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      scroll={{ y: 250 }}
      className={styles.dataTable}
    />
  );
};

export default React.memo(THTable);
