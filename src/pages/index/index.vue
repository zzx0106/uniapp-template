<template>
  <view class="content root">
    <view>
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    };
  },
  async onLoad() {
    // 监听悬浮栏
    await this.initObserver();
  },
  onUnload() {
    if (this._observer) this._observer.disconnect();
  },
  methods: {
    /** 初始化悬浮吸顶功能 */
    initObserver() {
      // this._observer = wx.createIntersectionObserver(this);
      // this._observer
      //   .relativeTo('.u-wrapper-trigger') // 以这个标签为基线
      //   .observe('.u-wrapper-lead', (res) => {
      //     if (!this.running && !this.isShowClassify) {
      //       this.fixed = res.intersectionRatio > 0;
      //     }
      //   });
    },
  },
};
</script>

<style>
.content {
  text-align: center;
  height: 400upx;
}

.logo {
  height: 200px;
  width: 200px;
  margin-top: 200px;
}

.title {
  font-size: 36upx;
  color: #8f8f94;
}
</style>
