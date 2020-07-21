<template>
  <view class="switch-component" :class="{ active }" @click="switchChange">
    <view class="sw-ball"> </view>
  </view>
</template>
<script>
/**
 * 使用方式
 * <my-switch @change="swChange"></my-switch>
 */
export default {
  name: 'switch-component', // name显示组件名，可以方便搜索
  data() {
    return {
      active: false,
    };
  },
  computed: {},
  onLoad() {},
  methods: {
    switchChange() {
      this.active = !this.active;
      this.$emit('change', this.active);
    },
  },
};
</script>
<style lang="scss" scoped>
.switch-component {
  width: 102px;
  height: 62px;
  background: rgba(255, 255, 255, 1);
  border-radius: 36px;
  border: 3px solid rgba(229, 229, 229, 1);
  transition: 0.3s ease;
  &.active {
    background: #3255a4;
    .sw-ball {
      transform: translateX(43px);
    }
  }
  .sw-ball {
    transition: 0.3s ease;
    transform: translateX(0px);
    border-radius: 50%;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(229, 229, 229, 1);
  }
}
</style>
