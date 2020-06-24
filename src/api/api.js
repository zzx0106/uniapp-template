import http from '../utils/http/index';
http.HOC_post = function(...arg) {
  // 过滤掉所有key为空的字段
  if (arg[1] && Object.keys(arg[1]).length > 0) {
    arg[1] = Object.keys(arg[1]).reduce((target, key) => {
      if (arg[1][key] !== '') {
        // 要设置不等于'' 因为可能出现0
        target[key] = arg[1][key];
      }
      return target;
    }, {});
  }
  return http.post(...arg);
};

export function api_zzx(params) {
  return http.HOC_post();
}
