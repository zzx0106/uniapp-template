function setStorage(key, value) {
  return uni.setStorageSync(key, value);
}
function removeStorage(key) {
  return uni.removeStorageSync(key);
}
function getStorage(key) {
  let msg = uni.getStorageSync(key);
  return msg;
}

/**
 * @desc 函数防抖
 * @param {Function} func 回调函数
 * @param {Number} delay 防抖时间
 * @param {Object} options {
 * leading: true, // 是否在延迟之前调用
 * context: null, // 上下文
 * }
 */
function debounce(func, delay = 17, options = { leading: true, context: null }) {
  let timer;
  const _debounce = function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    if (options.leading && !timer) {
      timer = setTimeout(null, delay);
      func.apply(options.context || this, args);
    } else {
      timer = setTimeout(() => {
        func.apply(options.context || this, args);
        timer = null;
      }, delay);
    }
  };
  _debounce.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };
  return _debounce;
}
/**
 * @desc 函数节流
 * @param {Function} func 回调函数
 * @param {Number} delay 节流时间
 * @param {Object} options {
 * leading: true, // 是否在延迟之前调用
 * trailing: false, //指定是否在超时后调用
 * context: null, // 上下文
 * }
 */
function throttle(func, delay = 1000, options = { leading: true, trailing: false, context: null }) {
  let previous = new Date(0).getTime();
  let timer = null;
  const _throttle = function (...args) {
    let now = new Date().getTime();
    if (!options.leading) {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        func.apply(options.context || this, args);
      }, delay);
    } else if (now - previous > delay) {
      func.apply(options.context || this, args);
      previous = now;
    } else if (options.trailing) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(options.context || this, args);
      }, delay);
    }
  };
  _throttle.cancel = () => {
    previous = 0;
    clearTimeout(timer);
    timer = null;
  };
  return _throttle;
}
/**
 * 图片懒加载
 * 需要在标签上使用data-src
 */
function lazyImageLoad() {
  let imgList = [...document.querySelectorAll('img')];
  let num = imgList.length;
  let lazyLoad = function () {};
  if (window['IntersectionObserver']) {
    /**当 img 标签进入可视区域时会执行实例化时的回调，
     * 同时给回调传入一个 entries 参数，保存着实例观察的所有元素的一些状态，
     * 比如每个元素的边界信息，当前元素对应的 DOM 节点，
     * 当前元素进入可视区域的比率，每当一个元素进入可视区域，
     * 将真正的图片赋值给当前 img 标签，同时解除对其的观察
     */
    lazyLoad = function () {
      let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
          }
        });
      });
      imgList.forEach((img) => {
        if (img.dataset.src) {
          observer.observe(img);
        }
      });
    };
  } else {
    lazyLoad = (function () {
      let count = 0;
      return function () {
        const deleteIndexList = [];
        imgList.forEach((img, index) => {
          const rect = img.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            if (img.dataset.src) img.src = img.dataset.src;
            deleteIndexList.push(index);
            count++;
            if (count === num) {
              document.removeEventListener('scroll', lazyLoad);
            }
          }
        });
        imgList = imgList.filter((_, index) => !deleteIndexList.includes(index));
      };
    })();
  }
  document.addEventListener('scroll', throttle(lazyLoad, 100));
  return lazyLoad();
}
/**
 * @desc 私有化对象属性
 * @param {Object} obj 需要私有化的变量名以 _ 开头
 */
function privatization(obj) {
  if (!window['Proxy']) {
    throw new Error('"Proxy" not support, you need babel-polyfill');
  }
  return new Proxy(obj, {
    get(target, key) {
      if (key.startsWith('_')) {
        throw new Error('private key');
      }
      return Reflect.get(target, key);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => !key.startsWith('_'));
    },
  });
}
/**
 * @desc async/await优化处理
 * @param {Function} asyncFunc promise对象
 * @param {Object | String} asyncFunc 传参
 * @returns {Array} [error , res]
 */
async function errorCaptured(asyncFunc, params) {
  try {
    let res = await asyncFunc(params);
    return [null, res];
  } catch (error) {
    return [error, null];
  }
}
/**
 * @desc 对象Key排序并生成key=value&
 * @param {Object} jsonObj 排序对象
 * @param {Boolean} isSort 是否排序
 */
function jsonSort(jsonObj, isSort = true) {
  let arr = [];
  for (let key in jsonObj) {
    if (jsonObj.hasOwnProperty(key)) arr.push(key);
  }
  isSort && arr.sort();
  let str = '';
  for (let i in arr) {
    // 过滤掉 Array.prototype.xxx进去的字段
    if (arr.hasOwnProperty(i)) {
      let value = '';
      if (Object.prototype.toString.call(jsonObj[arr[i]]) === '[object Object]') {
        value = JSON.stringify(jsonObj[arr[i]]);
      } else {
        value = jsonObj[arr[i]];
      }
      str += arr[i] + '=' + value + '&';
    }
  }
  return str.substr(0, str.length - 1);
}
// 精度计算
function P() {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger(obj) {
    return Math.floor(obj) === obj;
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger(floatNum) {
    let ret = { times: 1, num: 0 };
    let isNegative = floatNum < 0;
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    let strfi = floatNum + '';
    let dotPos = strfi.indexOf('.');
    let len = strfi.substr(dotPos + 1).length;
    let times = Math.pow(10, len);
    let intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10);
    ret.times = times;
    if (isNegative) {
      intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
  }

  /**
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation(a, b, op) {
    let o1 = toInteger(a);
    let o2 = toInteger(b);
    let n1 = o1.num;
    let n2 = o2.num;
    let t1 = o1.times;
    let t2 = o2.times;
    let max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
    }
  }

  function add(a, b) {
    return operation(a, b, 'add');
  }
  function subtract(a, b, digits) {
    return operation(a, b, 'subtract').toFixed(digits);
  }
  function multiply(a, b) {
    return operation(a, b, 'multiply');
  }
  function divide(a, b, digits) {
    return operation(a, b, 'divide').toFixed(digits);
  }

  // exports
  return {
    add,
    subtract,
    multiply,
    divide,
  };
}
/**
 * @desc 过滤掉空对象
 * @param {Object} body
 */
function filter(body) {
  // 过滤掉所有key为空的字段
  if (body && Object.keys(body).length > 0) {
    body = Object.keys(body).reduce((target, key) => {
      if (body[key] !== '') {
        // 要设置不等于'' 因为可能出现0
        target[key] = body[key];
      }
      return target;
    }, {});
  }
  return body;
}
function isAndroid() {
  let u = navigator.userAgent;
  // 安卓
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  return isAndroid;
}
function isIOS() {
  let u = navigator.userAgent;
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isIOS;
}
function isNull(data) {
  // 解决处理判断数字0=''的问题
  if (data === 0) {
    data = data.toString();
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  return data == null || data === '' || data === 'undefined';
}

//封装检测数据类型的函数
function checkedType(data) {
  return Object.prototype.toString.call(data).slice(8, -1);
}
/**
 * 深度克隆
 * @param {any} target
 */
function deepClone(target) {
  let result,
    targetType = checkedType(target);
  if (targetType == 'Object') {
    result = {};
  } else if (targetType == 'Array') {
    result = [];
  } else {
    return target; //普通数据类型直接返回
  }

  for (let i in target) {
    if (target.hasOwnProperty(i)) {
      let value = target[i];
      if (checkedType(value) == 'Object' || checkedType(value) == 'Array') {
        result[i] = deepClone(value);
      } else {
        result[i] = value;
      }
    }
  }
  return result;
}
/**
 * 对象深度合并
 * @param  {...Object} objArr 需要合并的对象 内部不允许有数组
 */
function deepMerge(...objArr) {
  let ret = {};
  function handler(key, source, ret) {
    let isObj = typeof source[key] == 'object'; //判断是否是对象
    if (isObj) {
      if (!ret[key]) {
        ret[key] = {}; //键名不存在，拷贝键名
      }
      // 由于是对象、递归深度拷贝
      Object.keys(source[key]).forEach((_key) => {
        handler(_key, source[key], ret[key]);
      });
    } else {
      // 是非引用类型、直接拷贝键名所对应的值
      ret[key] = source[key];
    }
  }
  // 遍历需要拷贝的对象、逐一深度拷贝
  objArr.forEach((obj, idx, _self) => {
    Object.keys(obj).forEach((key) => {
      handler(key, obj, ret);
    });
  });
  return ret;
}
/**
 * 获取系统语言
 * @return {string} zh en
 */
function getSysLanguage() {
  return window.navigator.language.slice(0, 2);
}

/**
 * 通过value找到对应key
 * @param {any} value 通过value取key
 * @param {Function} compare (a, b) => a === b 返回true或者false

 */
function findKey(data, value, compare = (a, b) => a === b) {
  return Object.keys(data).find((k) => compare(data[k], value));
}
/**
 * 小程序函数promise化
 * @param {Function} func 需要promise的对象
 * @param {Object} params 传入的参数
 * @returns {Promise}
 */
function adpPromise(func, params = {}) {
  return new Promise((resolve, reject) => {
    let op = Object.assign(
      {
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        },
      },
      params
    );
    func(op);
  });
}
function sleep(time = 1000) {
  return new Promise((res) => setTimeout(res, time));
}
/**
 * 获取系统信息
 */
function getSystemInfo() {
  const platform = uni.getSystemInfoSync();
  if (platform.model.includes('iPhone')) {
    platform.titleBarHeight = 44;
  } else {
    platform.titleBarHeight = 48;
  }
  platform.navHeight = platform.titleBarHeight + platform.statusBarHeight;
  // iPhone X、iPhone XS
  const isIPhoneX =
    /iphone/.test(platform.model.toLocaleLowerCase()) && Number(platform.screenWidth) == 375 && Number(platform.screenHeight) == 812;
  // iPhone XS Max
  const isIPhoneXSMax =
    /iphone/.test(platform.model.toLocaleLowerCase()) && Number(platform.screenWidth) == 414 && Number(platform.screenHeight) == 896;
  // iPhone XR
  const isIPhoneXR =
    /iphone/.test(platform.model.toLocaleLowerCase()) && Number(platform.screenWidth) == 414 && Number(platform.screenHeight) == 896;
  if (isIPhoneX || isIPhoneXSMax || isIPhoneXR) {
    platform.isIphoneX = true;
  }
  console.log('platform', platform);
  return platform;
}

export {
  getSystemInfo,
  sleep,
  adpPromise, // 小程序函数promise化
  findKey,
  getSysLanguage,
  setStorage,
  removeStorage,
  getStorage,
  isAndroid,
  isIOS,
  debounce, // 防抖
  throttle, // 节流
  lazyImageLoad, // 图片懒加载
  privatization, // 私有化对象属性
  errorCaptured, // async/await优化处理
  jsonSort, //对象Key排序并生成key=value&
  P, // 精度计算
  filter, // 过滤掉空对象
  isNull, // 判断数据是否为空
  deepClone, // 深克隆
  deepMerge, // 深合并
};
