<template>
  <view class="weui-cells">
    <view class="weui-cell">
      <view class="weui-cell__bd">
        <view class="weui-uploader">
          <!-- <view class="weui-uploader__hd">
            <view class="weui-uploader__title"><view class="title">图片上传</view>(最多可上传{{ count - value.length }}张)</view>
          </view> -->
          <view class="weui-uploader__bd">
            <view class="weui-uploader__files">
              <block v-for="(file, index) in getValue" :key="file.url">
                <view class="weui-uploader__file">
                  <div @click="deleteFile(index)">
                    <img class="del-btn" src="../../assets/images/close.png" alt="" />
                  </div>
                  <img
                    v-if="file.word"
                    src="../../assets/images/file_word.png"
                    class="weui-uploader__img file-img"
                    @longpress="deleteFile(index)"
                    @click="previewFile(file)" />
                  <img
                    v-if="file.pdf"
                    src="../../assets/images/file_pdf.png"
                    class="weui-uploader__img file-img"
                    @longpress="deleteFile(index)"
                    @click="previewFile(file)" />
                  <img
                    v-if="file.img"
                    class="weui-uploader__img"
                    :src="file.url"
                    @longpress="deleteFile(index)"
                    @click="previewImage(file)" />
                </view>
              </block>
            </view>
            <view :hidden="uploadHide" class="weui-uploader__input-box" :class="{ 'margin-left-32': value.length % 3 !== 0 }">
              <view v-if="mode === 'image'" class="uploade__text">上传照片</view>
              <view v-else class="uploade__text">上传附件</view>
              <view class="weui-uploader__input" @click="chooseFile"></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 使用方式
/**
 * 使用方式
 * <my-uploader v-model="imgFiles" mode="image" :count="1" />
 * <my-uploader
      v-model="otherFiles"
      mode="file"
      :count="10"
      :extension="['png', 'jpg', 'jpeg', 'gif', 'svg', 'doc', 'docx', 'pdf']" />
 */
import './image.css';
import { api_uploadFile } from '../../api/api';
import { adpPromise } from '../../utils/tools';
export default {
  name: 'my-uploader',
  props: {
    mode: {
      type: String,
      default: 'file', // all || video ||file || image
    },
    // 默认上传图片数
    count: {
      type: Number,
      default: 3,
    },
    // 过滤出哪些文件，mode为file时有效
    extension: {
      type: Array,
      default: function () {
        return []; // 'doc', 'docx', 'pdf'
      },
    },
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    uploadHide() {
      return this.value.length >= this.count;
    },
    getValue() {
      return this.value.map((v) => {
        const js = {
          url: v,
          img: /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(v),
          word: /\.(doc|docx)(\?.*)?$/.test(v),
          pdf: /\.(pdf)(\?.*)?$/.test(v),
        };
        return js;
      });
    },
  },
  methods: {
    /* 选取图片 */
    async chooseFile() {
      try {
        if (this.mode === 'image') {
          // 图片上传功能

          const check = await adpPromise(wx.showActionSheet, { itemList: ['从相册选取', '从聊天记录选取'] });
          if (check.tapIndex === 0) {
            // 相册选取
            this.chooseImage();
          } else {
            // 从聊天记录选取
            this.chooseImage('message');
          }
        } else {
          // 文件上传功能
          const itemList = ['从聊天记录选取'];
          if (this.mode === 'all') {
            // 如果mode为all 。支持用户从相册中选取
            itemList.unshift('从相册选取');
          } else {
            // 如果排除项中有图片，那么就显示从相册中选取
            if (this.extension.some((i) => /(png|jpe?g|gif|svg)(\?.*)?$/.test(i))) {
              itemList.unshift('从相册选取');
            }
          }
          const check = await adpPromise(wx.showActionSheet, { itemList });
          let choose = itemList[check.tapIndex];
          console.log('----', itemList, check.tapIndex, choose);
          if (choose === '从相册选取') {
            this.chooseImage();
          }
          if (choose === '从聊天记录选取') {
            let otherOption = {};
            if (this.mode === 'file' && this.extension.length > 0) {
              otherOption = { extension: this.extension };
            }
            const localFiles = await adpPromise(wx.chooseMessageFile, {
              count: this.count,
              type: this.mode,
              ...otherOption,
            });
            if (this.mode === 'file' && this.extension.length > 0) {
              // TODO 这个筛选做了，但感觉用处不大，因为微信筛选应该会给你筛选出对应类型文件
              const checkRes = await this.checkFiles(localFiles.tempFiles);
              // 将文件后缀名弄出来
              const unqualifieds = checkRes.map((r) => r.match(/[^\.]\w*$/)).join('、');
              if (checkRes.length > 0) return this.$Toast({ title: `不合规文件类型[${unqualifieds}]` });
            }
            console.log('localFiles', localFiles);
            this.uploader(localFiles.tempFiles);
          }
        }
      } catch (err) {
        console.error(err);
        if (err?.errMsg.includes('cancel')) return console.log('用户取消');
      }
    },
    /**
     * 检查文件是否合规
     * @param {Array} files 文件列表
     */
    checkFiles(files) {
      return files.reduce((t, { path }) => {
        if (this.extension.filter((e) => path.includes(e)).length === 0) {
          t.push(path);
        }
        return t;
      }, []);
    },
    /**
     * 选择图片
     * @param {Boolean} fromMessage 是否是从聊天记录选择
     */
    async chooseImage(fromMessage) {
      try {
        let file = null;
        if (fromMessage) {
          file = await adpPromise(wx.chooseMessageFile, { count: this.count, type: this.mode });
        } else {
          file = await adpPromise(wx.chooseImage, {
            sourceType: ['camera', 'album'], // 选择图片的来源 [相机， 相册]
            sizeType: ['compressed', 'original'], // 所选的图片的尺寸 [压缩， 原图]
            count: this.count,
          });
        }
        console.log('chooseImage file', file);
        this.uploader(file.tempFiles, 5 * 1024 * 1024);
      } catch (err) {
        console.log(err);
        if (err?.errMsg.includes('fail cancel')) {
          return console.log('用户取消');
        }
        console.log('err?.errMsg', err?.errMsg, err);
        this.$Toast({ title: '图片选取失败' });
      }
    },
    /**
     * 文件上传
     * @param {Array} 微信返回tempFIles数组
     * @param {Number} 文件大小限制 默认 最大10m
     */
    async uploader(tempFiles, maxSize = 10 * 1024 * 1024) {
      try {
        const imgs = tempFiles.reduce((target, file) => {
          if (file.size < maxSize) {
            target.push(api_uploadFile(file.path, file.path.randomName()));
          } else {
            this.$Toast({ title: `文件大小不能超过${(maxSize / 1048576) >> 0}M` });
          }
          return target;
        }, []);
        const remotImgs = await Promise.all(imgs);
        console.log('uploader remotImgs', remotImgs);
        let images = [...this.value, ...remotImgs].slice(0, this.count);
        this.$emit('input', images);
      } catch (err) {
        console.error('uploader', err);
        this.$Toast({ title: '上传失败' });
      }
    },
    /* 删除图片 */
    async deleteFile(index) {
      let images = this.value;
      const confirm = await this.$Modal({ title: '系统提示', content: '确定要删除此图片吗？' });
      if (confirm) {
        images.splice(index, 1);
      }
      this.$emit('input', images);
    },
    /** 预览文档文件 比如pdf等等 */
    previewFile({ url }) {
      wx.downloadFile({
        url,
        success: function (res) {
          console.log('downloadFile', res);
          wx.openDocument({
            filePath: res.tempFilePath,
            success(res) {
              console.log('打开文档成功');
            },
          });
        },
      });
    },
    /** 图片放大镜 */
    previewImage({ url: current }) {
      const urls = this.value.filter((file) => /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(file));
      wx.previewImage({
        current,
        urls,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.margin-left-32 {
  margin-left: 32px;
}
.title {
  height: 44px;
  font-size: 32px;
  font-weight: 400;
  color: rgba(23, 23, 23, 1);
  line-height: 44px;
  margin-right: 5px;
}
.file-img {
  width: 56px - 2px; // 2px的边框
  height: 70px - 2px;
  padding: 55px 62px;
  box-sizing: content-box;
}
.weui-uploader__input-box {
  background-color: rgba(0, 0, 0, 0.04);
  .uploade__text {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    position: absolute;
    width: 100%;
    top: 67%;
    text-align: center;
  }
}
.weui-uploader__bd {
  padding: 20px 0;
  .weui-uploader__file {
    position: relative;
    margin-right: 30px !important;
    &:last-child {
      margin-right: 0px !important;
    }
    .del-btn {
      position: absolute;
      top: -25px;
      right: -25px;
      padding: 10px 10px 30px 30px;
      width: 35px;
      height: 35px;
      z-index: 2;
    }
  }
}
</style>
