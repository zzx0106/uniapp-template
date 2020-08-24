import { adpPromise } from '../utils/tools';
const userLogin = () => {
  return new Promise(async (resolve, reject) => {
    const login = await adpPromise(uni.login, {
      // #ifdef MP-WEIXIN
      provider: 'weixin',
      // #endif
    });
    const code = login.code;
    // TODO 调用登录接口传递code，存入storage
    resolve();
  });
};
export default userLogin;
