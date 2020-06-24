import Vue from 'vue'; // 引用了type和value
import 'uni-app';
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * 调用toast弹窗
     ```javascript
      this.$Toast({
          title: '标题',
          duration: 3000 // 默认2000
      });
      ```
     */
    $Toast(options?: ShowToastOptions): Promise<any>;
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
