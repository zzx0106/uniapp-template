const os = require('os');
const path = require('path');
const join = path.join;
const fs = require('fs');
// vue inspect > config.js 生成配置到config.js 查看配置

// 添加全局scss文件
setGlobalScss();

module.exports = {
  outputDir: 'dist/app',
  lintOnSave: true, // 开启eslint
  parallel: os.cpus().length > 1, // 构建时开启多进程处理babel编译
  configureWebpack: (config) => {
    config.devtool = process.env.NODE_ENV === 'production' ? false : 'source-map';
    console.log('config---', config.css);
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
function setGlobalScss() {
  const fileNames = findSync('./src/assets/scss/global'); // 拿到global里面的所有文件路径
  const prefix = `// ----- inject start -----\r\n\r\n`;
  const suffix = `\r\n// ----- inject end -----`;
  if (fileNames.length > 0) {
    let cssGlobal = fileNames.map((filename) => `@import "${filename}";\r\n`.replace(/\\/g, '/')).join('');
    cssGlobal = `${prefix}${cssGlobal}${suffix}`;
    let files = fs.readFileSync('./src/uni.scss', 'utf8');
    const uniScss = files.replace(/(\/\/ ----- inject start -----)([\s\S]*?)(\/\/ ----- inject end -----)/g, cssGlobal);
    fs.writeFile('./src/uni.scss', uniScss, (err) => {
      if (err) throw err;
      console.log('\n\n' + '全局sass 已添加！');
    });
  }
}
function findSync(startPath) {
  let result = [];
  function finder(path) {
    let files = fs.readdirSync(path);
    files.forEach((val) => {
      let fPath = join(path, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) {
        if (fPath.indexOf('.md') === -1) {
          result.push(fPath);
        }
      }
    });
  }
  finder(startPath);
  return result;
}
