import Vue from 'vue'; // 引用了type和value
import 'uni-app';
interface platform extends GetSystemInfoResult {
  /**
   * 顶部导航加状态栏高度
   */
  navHeight: number;
  /**
   * 导航栏高度
   */
  titleBarHeight: number;
  /**
   * 是否是iphonex
   */
  isIphoneX: boolean;
}
declare module 'vue/types/vue' {
  interface Vue {
    /** 
     * 创建interval定时器 
     ```javascript
      this.creatTimeout(() => {
        // todo 
      }, 2000)
      ```
     */
    creatTimeout(callback: Function, duration?: number): void;
    /** 创建interval定时器
      ```javascript
      this.creatInterval(() => {
        // todo 
      }, 2000)
      ```
     */
    creatInterval(callback: Function, duration?: number): void;
    /**
     * 页面向上滚动到top的高度
     * @param top 想上滚动的距离
     * @param duration 滚动的时间
     */
    $scrollTo(top: number, duration?: number): Promise<any>;
    /**
     * 同步获取系统信息
     */
    $platform: platform;
    /**
     * 调用toast弹窗
     ```javascript
      this.$Toast({
          title: '标题',
          duration: 3000 // 默认2000
      });
      ```
     */
    $Toast(options: string | ShowToastOptions): Promise<any>;
    /**
     * 调用modal弹窗
     ```javascript
      this.$Modal({
          title: '标题',
          content: '内容',
          showCancel: true, // 显示cancel按钮
      });
      ```
     */
    $Modal(options?: ShowModalOptions): Promise<boolean>;
    /**
     * 跳转路由
      ```javascript
      this.$navigateTo('/path', {params: 123});
      ``` 
      */
    $navigateTo(url: string, data?: object): Promise<any>;
    /**
     * 重定向路由
      ```javascript
      this.$redirectTo('/path', {params: 123});
      ``` 
     */
    $redirectTo(url: string, data?: object): Promise<any>;
    /**
     * 路由返回，返回到顶层，重定向到home
      ```javascript
      this.$navigateBack(1);
      ``` 
     */
    $navigateBack(delta?: number): Promise<any>;
    /**
     * 删除所有页面,跳转到指定页面
      ```javascript
      this.$reLaunch('/path', {params: 123});
      ``` 
     */
    $reLaunch(url: string, data?: object): Promise<any>;
    /**
     * 跳转到tab页
      ```javascript
      this.$switchTab('/path', {params: 123});
      ``` 
     */
    $switchTab(url: string, data?: object): Promise<any>;
  }
}
