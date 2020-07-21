import { adpPromise } from '../utils/tools';
import WX from '../utils/WX';
const baseComponent = {
  data() {
    return {};
  },
  methods: {
    $scrollTo(top, duration = 300) {
      return new Promise(async (res, rej) => {
        wx.pageScrollTo({
          scrollTop: top,
          duration,
          success() {
            res();
          },
        });
      });
    },
    adpPromise,
    /**
     * toast弹窗
     * @param {Object} {title:标题|icon:是否显示图标(默认: none)|duration:显示时长(默认: 3000)}
     * @returns {Promise}
     */
    $Toast: WX.Toast,
    /**
     * modal层
     * @param {Object} param0 {title: 标题|content: 内容|showCancel:true 是否取消}
     */
    $Modal: WX.Modal,
    /**
     * 跳转
     * @param { String } url 跳转地址
     * @param { Object } data 跳转参数
     * @returns {Promise}
     */
    $navigateTo: WX.navigateTo,
    /**
     * 重定向
     * @param { String } url 跳转地址
     * @param { Object } data 跳转参数
     * @returns {Promise}
     */
    $redirectTo: WX.redirectTo,
    $navigateBack: WX.navigateBack,
    /**
     * 删除所有页面,跳转到指定页面
     * @param { String } url 跳转地址
     * @param { Object } data 跳转参数
     * @returns {Promise}
     */
    $reLaunch: WX.reLaunch,
    /**
     * 跳转到tab页
     * @param { String } url 跳转地址
     * @returns {Promise}
     */
    $switchTab: WX.switchTab,
  },
};
export default baseComponent;
