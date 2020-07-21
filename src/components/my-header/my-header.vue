<template>
  <view class="my-header-box" :style="{ height: nb_t_h + 'px', paddingTop: nb_h + 'px' }">
    <view
      class="my-header"
      :style="{ height: nb_t_h + 'px', paddingTop: nb_h + 'px' }"
      :class="{ 'mh-background': !noBackground, 'mh-border-bottom': border, 'mh-background-blue': blue }">
      <view class="title-bar" :class="{ single: hideBack || hideHome }" v-if="!hideBtn && nb_t_h > 0">
        <view @click="headerGoBack" v-if="!hideBack" class="tb-icon-back">
          <image v-if="!blue" class="icon" mode="widthFix" src="../../static/images/bar_back.png" alt="" />
          <image v-else class="icon" mode="widthFix" src="../../static/images/bar_back_white.png" alt="" />
        </view>
        <view class="tb-line border-right-1px-2x" :class="{ 'is-iphoneX': isIphoneX }"></view>
        <view @click="headerGoHome" v-if="!hideHome" class="tb-icon-home">
          <image v-if="!blue" class="icon" mode="widthFix" src="../../static/images/bar_home.png" />
          <image v-else class="icon" mode="widthFix" src="../../static/images/bar_home_white.png" />
        </view>
      </view>
      <view v-if="nb_t_h > 0" class="header-title">{{ title }}</view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    noBackground: { type: Boolean, default: false },
    border: { type: Boolean, default: false },
    blue: { type: Boolean, default: false },
    hideBack: { type: Boolean, default: false },
    hideHome: { type: Boolean, default: false },
    title: { type: String, default: '' },
    backUrl: { type: String, default: '' },
    hideBtn: { type: Boolean, default: false }, // 影藏状态栏
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
      // if (this.backUrl) return uni.reLaunch({ url: this.backUrl });
      // uni.navigateBack({ delta: 1 });
      this.$navigateBack(1);
    },
    headerGoHome() {
      // const pages = getCurrentPages();
      // console.log('pages', pages);
      // uni.reLaunch({ url: '/pages/home/home' });
      this.$reLaunch('/pages/home/home');
    },
  },
};
</script>
<style lang="scss" scoped>
.my-header-box {
  display: block;
  line-height: 1.2;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: auto;
  font-family: -apple-system;
  box-sizing: content-box;
  .my-header {
    display: flex;
    align-items: center;
    top: 0;
    position: fixed;
    width: 100%;
    z-index: 99999;
    box-sizing: content-box;
    &.mh-background {
      background-color: #ffffff;
    }
    &.mh-border-bottom {
      // border-bottom: 1px solid #e6e6e6;
      &:after {
        position: absolute;
        content: '';
        width: 200%;
        left: 0;
        bottom: 0;
        height: 2.5px; /* no */
        background-color: #e6e6e6;
        -webkit-transform: scale(1, 0.5);
        transform: scale(1, 0.5);
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom;
      }
    }

    &.mh-background-blue {
      background: #3255a4 !important;
      .title-bar {
        background: rgba(0, 0, 0, 0.14);
        border-radius: 16px; /* no */
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .header-title {
        color: #fff;
      }
    }
    .header-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px; /* no */
      color: #000;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .title-bar {
      display: flex;
      align-items: stretch;
      justify-content: center;
      margin-left: 20px;
      // padding: 0 24px;
      width: 87px; /* no */
      height: 32px; /* no */
      border: 1px solid rgba(234, 234, 234, 1);
      opacity: 1;
      border-radius: 16px; /* no */
      box-sizing: border-box;

      &.single {
        border: none;
        width: auto;
        .tb-line {
          display: none;
        }
      }
      .tb-line {
        margin: 6px 0; /* no */
        width: 1px;
        position: relative;
      }
      .tb-icon-back {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        // width: 21px;
        // height: 35px;
        flex: 1;
        // padding-left: 24px;
        .icon {
          width: 20px; /* no */
          height: 20px; /* no */
        }
      }
      .tb-icon-home {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        // width: 36px;
        // height: 32px;
        flex: 1;
        // padding-right: 24px;
        .icon {
          width: 20px; /* no */
          height: 20px; /* no */
        }
      }
    }
  }
}
</style>
