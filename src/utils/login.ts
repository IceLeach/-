// import { Login } from "@/services/api";
// import { message } from "antd";

const login = async (account: string, password: string) => {
  // try{
  //   const loginRes=await Login({loginName:account,password});
  //   document.cookie = `login=1&userName=${loginRes.userName}`;
  //   return true;
  // }catch(e){
  //   message.error('发生错误');
  //   return false;
  // }
  if (account === 'admin' && password === 'admin123') {
    // localStorage.setItem('login', '1');
    document.cookie = 'login=1';
    return true;
  } else {
    return false;
  }
};

export default login;
