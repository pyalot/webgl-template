define(function(require, exports, module){

window.mat4 = function() {
  return new Float32Array(16).m4identity();
};

Float32Array.prototype.perspective = function(fov, aspect, near, far) {
  var angle, bottom, left, math, pi, right, tan, top;
  math = Math;
  tan = math.tan;
  pi = math.PI;
  angle = (fov / 360) * pi;
  top = near * tan(angle);
  bottom = -top;
  right = top * aspect;
  left = -right;
  this[0] = (2 * near) / (right - left);
  this[8] = (right + left) / (right - left);
  this[5] = (2 * near) / (top - bottom);
  this[9] = (top + bottom) / (top - bottom);
  this[10] = -(far + near) / (far - near);
  this[14] = -(2 * far * near) / (far - near);
  this[11] = -1;
  return this;
};

Float32Array.prototype.m4identity = function() {
  this[0] = 1;
  this[1] = 0;
  this[2] = 0;
  this[3] = 0;
  this[4] = 0;
  this[5] = 1;
  this[6] = 0;
  this[7] = 0;
  this[8] = 0;
  this[9] = 0;
  this[10] = 1;
  this[11] = 0;
  this[12] = 0;
  this[13] = 0;
  this[14] = 0;
  this[15] = 1;
  return this;
};

Float32Array.prototype.m4translate = function(x, y, z) {
  var a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
  a00 = this[0];
  a01 = this[1];
  a02 = this[2];
  a03 = this[3];
  a10 = this[4];
  a11 = this[5];
  a12 = this[6];
  a13 = this[7];
  a20 = this[8];
  a21 = this[9];
  a22 = this[10];
  a23 = this[11];
  this[12] = a00 * x + a10 * y + a20 * z + this[12];
  this[13] = a01 * x + a11 * y + a21 * z + this[13];
  this[14] = a02 * x + a12 * y + a22 * z + this[14];
  this[15] = a03 * x + a13 * y + a23 * z + this[15];
  return this;
};

Float32Array.prototype.m4rotatex = function(angle) {
  var a10, a11, a12, a13, a20, a21, a22, a23, c, cos, math, rad, s, sin, tau;
  math = Math;
  sin = math.sin;
  cos = math.cos;
  tau = 2 * math.PI;
  rad = tau * (angle / 360);
  s = sin(rad);
  c = cos(rad);
  a10 = this[4];
  a11 = this[5];
  a12 = this[6];
  a13 = this[7];
  a20 = this[8];
  a21 = this[9];
  a22 = this[10];
  a23 = this[11];
  this[4] = a10 * c + a20 * s;
  this[5] = a11 * c + a21 * s;
  this[6] = a12 * c + a22 * s;
  this[7] = a13 * c + a23 * s;
  this[8] = a10 * -s + a20 * c;
  this[9] = a11 * -s + a21 * c;
  this[10] = a12 * -s + a22 * c;
  this[11] = a13 * -s + a23 * c;
  return this;
};

Float32Array.prototype.m4rotatey = function(angle) {
  var a00, a01, a02, a03, a20, a21, a22, a23, c, cos, math, rad, s, sin, tau;
  math = Math;
  sin = math.sin;
  cos = math.cos;
  tau = 2 * math.PI;
  rad = tau * (angle / 360);
  s = sin(rad);
  c = cos(rad);
  a00 = this[0];
  a01 = this[1];
  a02 = this[2];
  a03 = this[3];
  a20 = this[8];
  a21 = this[9];
  a22 = this[10];
  a23 = this[11];
  this[0] = a00 * c + a20 * -s;
  this[1] = a01 * c + a21 * -s;
  this[2] = a02 * c + a22 * -s;
  this[3] = a03 * c + a23 * -s;
  this[8] = a00 * s + a20 * c;
  this[9] = a01 * s + a21 * c;
  this[10] = a02 * s + a22 * c;
  this[11] = a03 * s + a23 * c;
  return this;
};

});
