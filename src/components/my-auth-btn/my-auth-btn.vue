<template>
  <view class="my-auth-btn">
    <view @click="touchBtn" class="auth-btn">
      {{ title }}
      <slot />
    </view>
    <u-popup @close="popClose" v-model="show" mode="center" :border-radius="16">
      <view class="u-model">
        <view class="u-model-title u-line-1">提示</view>
        <view class="u-model-content">
          <view class="u-model-content-message">检测到您未登录，请先登录！</view>
        </view>
        <view class="u-model-footer u-border-top">
          <view @click="cancelBtn" class="u-model-footer-button u-border-right">
            取消
          </view>

          <button open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true" class="u-model-footer-button submit btn">
            <u-loading mode="circle" color="#3255a4" v-if="loading"></u-loading>
            <block v-else>
              确定
            </block>
          </button>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'my-auth-btn', // name显示组件名，可以方便搜索
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: false,
      info: {},
      isClose: true,
      loading: false, // 确定按钮的loading icon
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  onLoad() {},
  methods: {
    ...mapActions('user', ['act_getUserInfo']),
    popClose(e) {
      console.log('popClose', this.show);
      if (this.isClose) return; // 点击mask会触发两次close
      this.isClose = true;
      // callback是每次点击取消能跳转
      this.$emit('callback', this.userInfo);
      // 如果是获取的结果，比如按得确定或者通过方法拿到了数据
      if (this.result) {
        this.$emit('result', this.userInfo);
        this.result = false;
      }
    },
    async touchBtn() {
      if (!this.userInfo.authorize) {
        this.show = true;
        this.isClose = false;
        return;
      }
      this.$emit('result', this.userInfo);
      this.$emit('callback', this.userInfo);
    },
    cancelBtn() {
      this.show = false;
    },
    async getUserInfo(e) {
      if (e.detail?.errMsg.includes('fail auth deny')) {
        return;
      }
      try {
        this.loading = true;
        await this.act_getUserInfo(e.detail.userInfo);
        this.result = true;
        this.show = false;
      } catch (e) {
        this.$Toast({ title: '登录失败，请重试' });
        console.error('my-auth-btn', e);
      }
      this.loading = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.my-auth-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  .u-model {
    height: auto;
    overflow: hidden;
    font-size: 32rpx;
    background-color: #fff;

    &-title {
      padding-top: 48rpx;
      font-weight: 500;
      text-align: center;
      color: $u-main-color;
    }

    &-content {
      &-message {
        padding: 48rpx;
        font-size: 30rpx;
        text-align: center;
        color: $u-content-color;
      }
    }

    &-footer {
      display: flex;

      &-button {
        flex: 1;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 32rpx;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;
        border-radius: 4rpx;
        &.submit {
          color: #3255a4;
        }
      }
    }
  }
}
</style>
