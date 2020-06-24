<template>
  <cover-view class="my-header-box" :style="{ height: nb_t_h + 'px', paddingTop: nb_h + 'px' }">
    <cover-view
      class="my-header"
      :style="{ height: nb_t_h + 'px', paddingTop: nb_h + 'px' }"
      :class="{ background: !noBackground, 'border-bottom': !noBorder, 'background-gray': gray }"
    >
      <cover-view class="title-bar" v-if="!hideBtn">
        <cover-view class="back" @click="headerGoBack" v-if="!hideBack && nb_t_h > 0">
          <cover-image class="icon" mode="widthFix" src="../../static/images/left_icon.png" alt="" />
          <cover-view v-if="time > 0">{{ time }}S</cover-view>
        </cover-view>
      </cover-view>
      <cover-view v-if="nb_t_h > 0" class="header-title">{{ title }}</cover-view>
    </cover-view>
  </cover-view>
</template>
<script>
export default {
  props: {
    noBackground: { type: Boolean, default: false },
    noBorder: { type: Boolean, default: false },
    gray: { type: Boolean, default: false },
    hideBack: { type: Boolean, default: false },
    hideHome: { type: Boolean, default: false },
    title: { type: String, default: '' },
    backUrl: { type: String, default: '' },
    hideBtn: { type: Boolean, default: false },
    time: { type: Number, default: 0 },
  },
  data() {
    return {
      nb_h: 30,
      nb_t_h: 46,
      isIphoneX: false,
    };
  },
  created() {
    try {
      let navbarTitleHeight = this.$platform.titleBarHeight || 46;
      let navbarHeight = this.$platform.statusBarHeight || 30;
      this.isIphoneX = this.$platform.isIphoneX;
      this.nb_h = navbarHeight;
      this.nb_t_h = navbarTitleHeight;
    } catch (error) {
      console.log('navbar componentDidMount error', error);
      this.nb_h = 30;
      this.nb_t_h = 46;
    }
  },
  methods: {
    headerGoBack() {
      if (this.backUrl) return uni.reLaunch({ url: this.backUrl });
      uni.navigateBack({ delta: 1 });
    },
    headerGoHome() {
      const pages = getCurrentPages();
      console.log('pages', pages);
      uni.reLaunch({ url: '/pages/home/home' });
    },
  },
};
</script>
<style lang="scss" scoped>
.my-header-box {
  .my-header {
    display: flex;
    align-items: center;
    top: 0;
    position: fixed;
    width: 100%;
    z-index: 99999;
    .header-title {
      position: absolute;
      left: 50%;
      font-size: 36rpx;
      font-weight: 500;
      transform: translateX(-50%);
      font-size: 36rpx;
      color: #000;
    }
    .border-bottom {
      border-bottom: 1px solid #e6e6e6;
    }
    .background {
      background-color: #ffffff;
    }
    .background-gray {
      background: #fff !important;
    }
    .title-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 30rpx;
      // padding: 0 24rpx;
      // width: 174rpx;
      // height: 64rpx;
      // border: 1rpx solid rgba(234, 234, 234, 1);
      opacity: 1;
      border-radius: 32rpx;
      box-sizing: border-box;
      .line {
        border-left: 3rpx solid #cccccc;
        height: 37rpx;
        margin: 0 30rpx;
      }
      .back {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        // width: 40rpx;
        height: 40rpx;
        // padding-left: 24rpx;
        .icon {
          width: 40rpx;
          height: 40rpx;
          margin-right: 10rpx;
        }
      }
      .home {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        width: 40rpx;
        height: 40rpx;
        padding-right: 24rpx;
        .icon {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
}
</style>
