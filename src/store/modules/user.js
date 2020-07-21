import WX from '../../utils/WX';
import { api_login } from '../../api/api';
import { setStorage, getStorage } from '../../utils/tools';
import formStore from '../../utils/form_store';
export default {
  namespaced: true,
  state: {
    userInfo: {
      fetched: false,
      authorize: false,
      code: '',
      account_num: '',
      avatarUrl: '',
      city: '',
      country: '',
      gender: 1,
      language: 'zh_CN',
      nickName: '',
      province: '',
      openId: '',
    },
  },
  mutations: {
    mut_setUserInfo(state, info) {
      state.userInfo = info;
    },
    mut_refreshCode(state, code) {
      state.userInfo.code = code;
    },
  },
  getters: {},
  actions: {
    async act_initUserInfo({ state, commit }) {
      const info = JSON.parse(JSON.stringify(state.userInfo));
      try {
        if (info['fetched']) return; // 只允许init一次
        const setting = await WX.getSetting();
        info.authorize = !!setting.authSetting['scope.userInfo'];
        const code = await WX.login();
        info.code = code;
        console.log('code', code);
        const login = await api_login({ code });
        if (login.openId) {
          info.openId = login.openId;
          formStore.update({ openId: login.openId });
        }
        Object.assign(info, { openId: login.openId });
        if (info.authorize) {
          info.fetched = true;
          const { userInfo } = await WX.getUserInfo();
          if (login.openId) {
            Object.assign(info, userInfo);
            // setStorage('userInfo', { openId: login.openId, ...userInfo });
          } else {
            info.authorize = false;
          }
        }
      } catch (error) {
        wx.showToast({ title: '登录失败', icon: 'none' });
        console.error('act_initUserInfo error', error);
        info.authorize = false; // 如果接口返回错误，就让用户走未授权的流程，自己登陆
      }
      commit('mut_setUserInfo', info);
    },
    async act_getUserInfo({ state, commit }, params) {
      const info = JSON.parse(JSON.stringify(state.userInfo));
      try {
        // 思考1 ： code只能使用一次，那么需要考虑到code的情况
        const code = await WX.login();
        console.log('获取新的code');
        info.code = code;
        info.authorize = true;
        const login = await api_login({ code });
        if (login.openId) {
          info.fetched = true;
          Object.assign(info, { openId: login.openId, ...params, code });
          // setStorage('userInfo', { openId: login.openId });
        } else {
          info.code = await WX.login(); // 这里错误一般都是code不对导致
          info.authorize = false; // 如果接口返回错误，就让用户走未授权的流程，自己登陆
        }
        console.log('act_getUserInfo baseInfo', info);
        commit('mut_setUserInfo', info);
        return Promise.resolve(info);
      } catch (error) {
        console.error('act_getUserInfo error', error);
        info.authorize = false; // 如果接口返回错误，就让用户走未授权的流程，自己登陆
        commit('mut_setUserInfo', info);
        return Promise.reject(error);
      }
    },
    async act_checkSession({ state, dispatch, commit }) {
      if (!state.userInfo.fetched) return; // 如果没有init过，不走session校验，因为当前情况下会触发init
      const sessionOk = await WX.checkSession();
      if (!sessionOk) {
        dispatch('act_initUserInfo'); // 失效了就走登陆流程
      }
    },
  },
};
