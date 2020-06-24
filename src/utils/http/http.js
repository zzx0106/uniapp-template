import { jsonSort } from '../tools';

const defaultConfig = {
  baseUrl: '',
  url: '',
  method: 'GET',
  type: 'json',
};

function isHttpSuccess(status) {
  return (status >= 200 && status < 300) || status == 304;
}

function encodeObject2UrlParams(params = {}) {
  const tempArr = [];
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      tempArr.push(`${key}=${params[key]}`);
    }
  }
  return tempArr.join('&');
}

function buildFullPath(config) {
  //处理get请求
  if (config.method == 'GET') {
    if (typeof config.data == 'object') {
      const str = encodeObject2UrlParams(config.data);
      if (str) {
        config.url += `?${str}`;
      }
    }
  }
  return /^(http)|^(https)/.test(config.url) ? config.url : config.baseUrl + config.url;
}

/**
 * 请求适配器
 */
function dispatchRequest(config) {
  return new Promise((resolve, reject) => {
    const handleConfig = Object.assign({}, config, {
      url: buildFullPath(config),
      success: (response) => {
        if (isHttpSuccess(response.statusCode)) {
          resolve({
            statusCode: response.statusCode,
            errMsg: response.errMsg,
            config: config,
            data: response.data,
            header: response.header,
          });
        } else {
          reject({
            config: config,
            errMsg: response.errMsg,
            response: response,
          });
        }
      },
      fail: (err) => {
        reject({
          config: config,
          errMsg: err.errMsg || '',
        });
      },
    });
    uni.request(handleConfig);
  });
}

/**
 * 插件管理器
 */
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected,
    });

    return this.handlers.length - 1;
  }

  forEach(fn) {
    for (let i = 0, l = this.handlers.length; i < l; i++) {
      if (this.handlers[i] !== null) {
        fn.call(null, this.handlers[i], i, this.handlers);
      }
    }
  }
}

/**
 * 构造请求
 */
class Request {
  constructor(options = {}) {
    this.config = Object.assign({}, defaultConfig, options);
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }
  post(url, data) {
    console.log('post--->', url, data);
    return this.request({
      url,
      data,
      method: 'POST',
    });
  }
  get(url, data) {
    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      url += `?${jsonSort(data)}`;
    }
    return this.request({
      url,
      method: 'GET',
    });
  }
  request(config) {
    if (typeof config == 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = Object.assign({}, this.config, config);

    if (config.method) {
      config.method = config.method.toUpperCase();
    } else {
      config.method = 'GET';
    }

    let chain = [dispatchRequest, undefined];

    let promise = Promise.resolve(config);

    //执行请求插件队列
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    //执行响应插件队列
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    // 构造队列
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }
}

export default Request;
