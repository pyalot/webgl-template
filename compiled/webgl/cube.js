define(function(require, exports, module){
var Cube;

return Cube = (function() {
  var float_size, normal_off, position_off, stride;

  float_size = Float32Array.BYTES_PER_ELEMENT;

  position_off = 0;

  normal_off = 3;

  stride = 6 * float_size;

  function Cube(gl, size) {
    var data, s, vertices;
    this.gl = gl;
    s = size || 1;
    vertices = [-s, -s, -s, 0, 0, -1, -s, s, -s, 0, 0, -1, s, s, -s, 0, 0, -1, s, -s, -s, 0, 0, -1, -s, -s, -s, 0, 0, -1, s, s, -s, 0, 0, -1, s, s, s, 0, 0, 1, -s, s, s, 0, 0, 1, -s, -s, s, 0, 0, 1, s, s, s, 0, 0, 1, -s, -s, s, 0, 0, 1, s, -s, s, 0, 0, 1, -s, s, -s, 0, 1, 0, -s, s, s, 0, 1, 0, s, s, s, 0, 1, 0, s, s, -s, 0, 1, 0, -s, s, -s, 0, 1, 0, s, s, s, 0, 1, 0, s, -s, s, 0, -1, 0, -s, -s, s, 0, -1, 0, -s, -s, -s, 0, -1, 0, s, -s, s, 0, -1, 0, -s, -s, -s, 0, -1, 0, s, -s, -s, 0, -1, 0, -s, -s, -s, -1, 0, 0, -s, -s, s, -1, 0, 0, -s, s, s, -1, 0, 0, -s, s, -s, -1, 0, 0, -s, -s, -s, -1, 0, 0, -s, s, s, -1, 0, 0, s, s, s, 1, 0, 0, s, -s, s, 1, 0, 0, s, -s, -s, 1, 0, 0, s, s, s, 1, 0, 0, s, -s, -s, 1, 0, 0, s, s, -s, 1, 0, 0];
    data = new Float32Array(vertices);
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  Cube.prototype.setPointer = function(name, size, start, shader) {
    var location;
    location = shader.attribLoc(name);
    if (location >= 0) {
      this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, stride, start * float_size);
    }
    return this;
  };

  Cube.prototype.setPointersForShader = function(shader) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.setPointer('position', 3, position_off, shader);
    this.setPointer('normal', 3, normal_off, shader);
    return this;
  };

  Cube.prototype.draw = function(shader) {
    if (shader) setPointersForShader(shader);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * 2 * 3);
    return this;
  };

  return Cube;

})();

});
