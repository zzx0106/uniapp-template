const config = {
  // 这个域名需要与上传图片的域名对应
  baseUrl: 'https://xxx',
};

for (let key in config) {
  if (config.hasOwnProperty(key)) {
    // 禁止修改config中的字段
    Object.defineProperty(config, key, { writable: false });
  }
}
export default config;
