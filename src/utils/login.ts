import { Login } from '@/services/api';
import { message } from 'antd';

const login = async (account: string, password: string) => {
  try {
    const loginRes = await Login({ loginName: account, password });
    // console.log('loginRes', loginRes)
    if (!loginRes.data) {
      return false;
    } else {
      document.cookie = 'login=1';
      document.cookie = `userId=${loginRes.data.userId}`;
      document.cookie = `userName=${loginRes.data.userName}`;
      return true;
    }
  } catch (e) {
    message.error('发生错误');
    return false;
  }
  // if (account === 'admin' && password === 'admin123') {
  //   // localStorage.setItem('login', '1');
  //   document.cookie = 'login=1';
  //   return true;
  // } else {
  //   return false;
  // }
};

export default login;
