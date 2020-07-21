<template>
  <view class="my-swiper-dot">
    <view class="dots">
      <view :class="['dot-item', current == index ? 'active' : '']" v-for="(item, index) in list" :key="index"></view>
    </view>
  </view>
</template>
<script>
/**
 * 使用方式
 * <my-swiper-dot class="banner-dot" :current="currIndex" :list="bannerList"></my-swiper-dot>
 */
export default {
  name: 'my-swiper-dot', // name显示组件名，可以方便搜索
  props: ['list', 'current'],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.my-swiper-dot {
  position: relative;
  z-index: 5;
  height: 0;
  .dots {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 46px;
    left: 50%;
    transform: translateX(-50%);
  }
  .dot-item {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #d8d9de;
    margin: 0 4px;
    box-sizing: border-box;
    &.active {
      width: 14px;
      height: 14px;
      background-color: #ffffff;
    }
  }
}
</style>
