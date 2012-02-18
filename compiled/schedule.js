define(function(require, exports, module){

return function(callback) {
  var last, request, start, step;
  last = Date.now();
  start = last;
  request = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(fun) {
    return setTimeout(fun, 1000 / 30);
  };
  step = function() {
    var current, delta;
    current = Date.now();
    delta = current - last;
    last = current;
    callback((current - start) / 1000, delta / 1000);
    return request(step);
  };
  return request(step);
};

});
