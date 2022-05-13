import React from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import login from '@/utils/login';
import { message } from 'antd';
import styles from './index.less';

interface LoginPageProps {
  setIsLogin: (login: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
  const { setIsLogin } = props;

  return (
    <div className={styles.loginForm}>
      <LoginForm
        title="宁波舟山港大屏"
        subTitle={<></>}
        onFinish={(value) => {
          const isOK = login(value.account, value.password);
          if (isOK) {
            setIsLogin(true);
          } else {
            message.error('账号或密码错误');
          }
          return Promise.resolve();
        }}
      >
        <ProFormText
          name="account"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          // placeholder={'用户名: admin'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          // placeholder={'密码: admin123'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginForm>
    </div>
  );
};

export default React.memo(LoginPage);
