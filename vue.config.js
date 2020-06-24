const os = require('os');
const path = require('path');
// vue inspect > config.js 生成配置到config.js 查看配置

module.exports = {
  outputDir: 'dist/app',
  lintOnSave: true, // 开启eslint
  parallel: os.cpus().length > 1, // 构建时开启多进程处理babel编译
  configureWebpack: (config) => {
    config.devtool = process.env.NODE_ENV === 'production' ? false : 'source-map';
  },
  chainWebpack: (config) => {
    config.module
      .rule('eslint')
      .test(/\.(js|vue)$/)
      // .enforce('pre') // pre 优先处理|normal 正常处理(默认)|inline 其次处理|post 最后处理
      .pre() // 感觉应该是上面的简写
      .include.add(path.resolve(__dirname, 'src'))
      .end() // include要加end才行
      .use('eslint-loader')
      .loader('eslint-loader');
  },
};
