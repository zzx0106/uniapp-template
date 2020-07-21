import HTTP from './http';
import userLogin from '../login';
import { setStorageSync } from '../tools';
import config from '../../config/config';
const http = new HTTP({
  baseUrl: config.baseUrl + '/api/xxxx',
});
const http = new HTTP();
http.interceptors.request.use(
  async (request) => {
    request.headers = {
      // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    };
    // 如果没有http s开头，而是以纯str开头
    if (!request.url) return Promise.reject('url 不能为空');
    if (request.method === 'GET') return request;

    console.log(`%c 发送 ${request.url} ---> } `, 'background:#2472C8;color:#fff', JSON.parse(JSON.stringify(request.data || {})));
    return request;
  },
  (error) => {
    console.error('interceptors.request', error);
    return Promise.reject(error);
  }
);
/**
 * 注：最下面还有对post请求做了二级处理的，不要忽视
 */
http.interceptors.response.use(
  (response) => {
    console.log(`%c 接收 ${response.config.url}`, 'background:#1E1E1E;color:#bada55', JSON.parse(JSON.stringify(response.data)));
    const code = Number(response.data.code);
    if (code === 0) {
      return Promise.resolve(response.data.data);
    } else {
      // 未绑定状态，直接跳转绑定页
      if (code === 4000) {
        const cp = getCurrentPages();
        if (cp[cp.length - 1].route === 'pages/setting/bind/bind') return Promise.resolve(response.data);
        uni.navigateTo({ url: '/pages/setting/bind/bind' });
      } else if (code === 40055) {
        // 轮询接口不报错误，40055代表继续轮询
        return Promise.reject(response.data);
      } else if (code === 4117) {
        uni.showToast({ title: `支付中，请稍后...`, icon: 'none' });
        return Promise.resolve(response.data.data);
      } else {
        console.error('请求失败', response.data);
        // 为了解决hideloading让toast消失的问题（不确定？
        setTimeout(() => uni.showToast({ title: `请求失败：${response.data.msg}`, icon: 'none' }), 300);
        return Promise.reject(response.data);
      }
    }
  },
  (error) => {
    console.error('进入http错误', error);
    if (error.response) {
      // 网络出现500 或 400
      if (/^50[0-9]/.test(error.response.statusCode)) {
        // 服务器错误
        uni.showToast({ title: `服务器错误 [${error.response.statusCode}]`, icon: 'none' });
      } else if (/^4[0-1][0-9]/.test(error.response.statusCode)) {
        // 本地请求错误
        uni.showToast({ title: `请求出错 [${error.response.statusCode}]`, icon: 'none' });
      }
      return Promise.reject(error.response);
    } else {
      // wx.request fail 错误
      uni.showToast({ title: '网络开小差了', icon: 'none' });
      return Promise.reject(error);
    }
  }
);
const _http = http.post;
let times = 0; // 重新登录的次数
http.post = (url, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const httpRes = await _http.call(http, url, params);
      resolve(httpRes);
    } catch (error) {
      // 如果code为999（登录态失效）
      // 当没有code 或者code为0时，直接略过
      if (error.code == 999) {
        // 这里暂未处理登录态问题，该小程序无需登录态，所以没有这个操作
        if (times >= 5) {
          times = 0;
          setStorageSync('userInfo', {});
          reject(error);
        } else {
          times++;
          const user = await userLogin(); // TODO 这里暂未处理登录状态
          const resData = await http.post(url, params); // 继续执行未执行的接口
          i = 0;
          resolve(resData);
        }
      } else {
        reject(error);
      }
    }
  });
};
export default http;
