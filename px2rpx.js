'use strict';

const postcss = require('postcss');
module.exports = postcss.plugin('postcss-px2rpx', function(options) {
  const opts = Object.assign(
    {
      viewportWidth: 750 / 750,
      unitPrecision: 5, // 最多保留5位小数
      minPixelValue: 1, // 最小单位，此单位不会被转换
      viewportUnit: 'rpx', // 被转换的单位
    },
    options
  );
  const pxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/gi;
  return function(css) {
    css.walkDecls(function(decl, i) {
      if (decl.value.indexOf('px') === -1) return;
      let value = decl.value;
      if (opts.viewportWidth) {
        const pxReplaceForRpx = createPxReplace(opts.viewportWidth, opts.minPixelValue, opts.unitPrecision, opts.viewportUnit);
        decl.value = value.replace(pxRegex, pxReplaceForRpx);
      }
    });
  };
});
function createPxReplace(perRatio, minPixelValue, unitPrecision, unit) {
  return function(m, $1) {
    if (!$1) return m;
    const pixels = parseFloat($1);
    if (pixels <= minPixelValue) return m;
    return toFixed(pixels / perRatio, unitPrecision) + unit;
  };
}

function toFixed(number, precision) {
  let multiplier = Math.pow(10, precision + 1);
  let wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}
