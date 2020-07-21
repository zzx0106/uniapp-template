import { throttle, jsonSort } from './tools';
import { api_login } from '../api/api';

export default new (class {
  querySelect(tagName) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(tagName)
        .boundingClientRect()
        .exec((res) => {
          resolve(res);
        });
    });
  }
  /**
   * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
   */
  getSetting() {
    return new Promise((res, rej) => {
      wx.getSetting({
        success(resSetting) {
          res(resSetting);
        },
        fail(err) {
          console.error('getSetting error', err);
          rej(err);
        },
      });
    });
  }
  login() {
    return new Promise((res, rej) => {
      uni.login({
        success: (resLogin) => {
          console.log('resLogin', resLogin, !resLogin.code);
          if (!resLogin.code) {
            rej('登录失败！' + resLogin.errMsg);
          }
          console.log('login----> code: ', resLogin.code);
          res(resLogin.code);
        },
        fail(err) {
          console.log(err);
          rej(err);
        },
      });
    });
  }
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        withCredentials: true,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }
  /**
   * 检测code是否过期
   */
  checkSession() {
    return new Promise((resolve, reject) => {
      uni.checkSession({
        success: () => {
          resolve(true);
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  }
  async getOpenId() {
    try {
      const code = await this.login();
      const res = await api_login({ code });
      if (res.openId) {
        return res.openId;
      }
      return '';
    } catch (err) {
      this.Toast('登录失败');
      console.error('getOpenId err', err);
      return '';
    }
  }
  /**
   * toast弹窗
   * @param {Object} {title:标题|icon:是否显示图标(默认: none)|duration:显示时长(默认: 3000)}
   * @returns {Promise}
   */

  Toast(params) {
    if (params && Object.prototype.toString.call(params) === '[object String]') {
      params = { title: params, icon: 'none', duration: 3000 };
    }
    if (params && Object.prototype.toString.call(params) === '[object Object]') {
      const { title = '', icon = 'none', duration = 3000 } = params;
      if (!title) return;
      return new Promise((res, rej) => {
        console.log('params', params);
        uni.showToast({ title, icon, duration });
        setTimeout(() => res(), duration);
      });
    }
    return Promise.resolve('');
  }
  /**
   * modal层
   * @param {Object} param0 {title: 标题|content: 内容|showCancel:true 是否取消}
   */
  Modal({ title, content, showCancel = true }) {
    return new Promise((resolve, rej) => {
      uni.showModal({
        title,
        content,
        showCancel,
        success(res) {
          if (res.confirm) {
            resolve(true);
          } else if (res.cancel) {
            resolve(false);
          }
        },
      });
    });
  }
  // 导航----------------------------------
  /** 页面回退做了优化，如果栈首是home页，就不用relaunch了 */
  pageBack() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1].route;
    if (pages.length === 1) {
      // 页面栈只有一个页面，而且是pay
      if (currentPage === 'pages/home/home') {
        return console.sys('顶层页面');
      } else {
        uni.reLaunch({ url: '/pages/home/home' });
      }
    } else {
      uni.navigateBack({ delta: 1 });
    }
  }
  /** 系统级别的返回 */
  sysBack() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1].route;
    if (pages.length === 1) {
      // 页面栈只有一个页面，而且是pay
      if (currentPage === 'pages/home/home') {
        if (Date.now() - currentTime > 2000) {
          currentTime = Date.now();
          this.Toast('再按一次退出小程序');
        } else {
          cm._exitMp();
        }
      } else {
        uni.reLaunch({ url: '/pages/home/home' });
      }
    } else {
      uni.navigateBack({ delta: 1 });
    }
  }
  /**
   * 跳转
   * @param { String } url 跳转地址
   * @param { Object } data 跳转参数
   * @returns {Promise}
   */
  navigateTo = throttle((url, data) => {
    if (!url || typeof url !== 'string') {
      throw new Error(`[Router.push] url 不能为空且必须是字符`);
    }
    // 保持原有的地址, 用于重定向是使用
    let tempUrl = url;

    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      url += `?${jsonSort(data)}`;
    }
    return new Promise((resolve, reject) => {
      const pageArr = getCurrentPages();

      // 如果大于设置的页面临界值, 则用重定向, 否则正常跳转
      if (pageArr.length >= 10) {
        this.redirectTo(tempUrl, data).then(resolve).catch(reject);
      } else {
        uni.navigateTo({
          url,
          success(res) {
            resolve(res);
          },
          fail(err) {
            reject(err);
          },
        });
      }
    });
  });
  /**
   * 重定向
   * @param { String } url 跳转地址
   * @param { Object } data 跳转参数
   * @returns {Promise}
   */
  redirectTo = throttle((url, data) => {
    if (!url || typeof url !== 'string') {
      throw new Error(`[Router.redirect] url 不能为空且必须是字符`);
    }
    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      url += `?${jsonSort(data)}`;
    }
    return new Promise((resolve, reject) => {
      uni.redirectTo({
        url,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  });
  /**
   * 页面回退
   * 如果回退到栈首，那么就跳转home页
   */
  navigateBack = throttle((delta = 1) => {
    uni.navigateBack({
      delta,
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('first page')) {
          // relaunch到home页面
          this.reLaunch('/pages/home/home');
        }
      },
    });
  });
  /**
   * 删除所有页面,跳转到指定页面
   * @param { String } url 跳转地址
   * @param { Object } data 跳转参数
   * @returns {Promise}
   */
  reLaunch = throttle((url, data) => {
    if (!url || typeof url !== 'string') {
      throw new Error(`[Router.reLaunch] url 不能为空且必须是字符`);
    }
    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      url += `?${jsonSort(data)}`;
    }
    return new Promise((resolve, reject) => {
      uni.reLaunch({
        url,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  });
  /**
   * 跳转到tab页
   * @param { String } url 跳转地址
   * @returns {Promise}
   */
  switchTab = throttle((url) => {
    return new Promise((resolve, reject) => {
      uni.switchTab({
        url,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  });
})();
