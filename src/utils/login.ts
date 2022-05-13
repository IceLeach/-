const login = (account: string, password: string) => {
  if (account === 'admin' && password === 'admin123') {
    // localStorage.setItem('login', '1');
    document.cookie = 'login=1';
    return true;
  } else {
    return false;
  }
};

export default login;
