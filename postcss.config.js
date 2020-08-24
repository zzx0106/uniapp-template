const path = require('path');
module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve(id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3));
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2));
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1));
        }
        return id;
      },
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5',
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss'),
    require('./px2rpx')({
      viewportWidth: 750, // 设计稿宽度
      unitPrecision: 3, // px to rpx无法整除时，保留几位小数
      viewportUnit: 'rpx', // 转换成rpx单位
      // selectorBlackList: ['::after', '::before'], // 不转换的类名 ['::after','::before'] 待验证 已有的after befor不会被覆盖
      minPixelValue: 1, // 小于1px不转换
      mediaQuery: false, // 允许媒体查询中转换
      exclude: /(\/|\\)(node_modules)(\/|\\)/, // 排除node_modules文件中第三方css文件
    }),
  ],
};
