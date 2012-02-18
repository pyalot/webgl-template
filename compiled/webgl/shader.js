define(function(require, exports, module){
var Shader, current, resolveInclude;

current = null;

resolveInclude = function(file_lines, included, dependencies, name) {
  var dependency, fileno, line, result, _i, _j, _len, _len2, _ref, _ref2;
  dependency = dependencies[name];
  if (included.indexOf(dependency.name) === -1) {
    result = [];
    fileno = included.length;
    included.push(dependency.name);
    file_lines[dependency.name] = {};
    _ref = dependency.source;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (line.text) {
        file_lines[dependency.name][line.num] = line.text;
        result.push({
          num: line.num,
          text: line.text,
          fileno: fileno
        });
      } else {
        _ref2 = resolveInclude(file_lines, included, dependency.dependencies, line.include);
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          line = _ref2[_j];
          result.push(line);
        }
      }
    }
    return result;
  } else {
    return [];
  }
};

return Shader = (function() {

  function Shader(gl, params, dependencies) {
    this.gl = gl;
    this.dependencies = dependencies;
    this.name = params.name;
    this.lines = params.lines;
    this.program = this.gl.createProgram();
    this.vs = this.gl.createShader(gl.VERTEX_SHADER);
    this.fs = this.gl.createShader(gl.FRAGMENT_SHADER);
    this.gl.attachShader(this.program, this.vs);
    this.gl.attachShader(this.program, this.fs);
    this.link(params.vertex, params.fragment);
  }

  Shader.prototype.link = function(vertex, fragment) {
    this.compile(this.vs, vertex);
    this.compile(this.fs, fragment);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog;
    }
    this.attrib_cache = {};
    this.uniform_cache = {};
    return this;
  };

  Shader.prototype.compile = function(shader, lines) {
    var file_lines, included, line, result, source, _i, _j, _k, _len, _len2, _len3, _ref;
    source = [];
    included = [this.name];
    file_lines = {};
    file_lines[this.name] = {};
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      if (typeof line === 'string') {
        source.push(line);
      } else {
        if (line.text) {
          file_lines[this.name][line.num] = line.text;
          source.push({
            num: line.num,
            text: line.text,
            fileno: 0
          });
        } else {
          _ref = resolveInclude(file_lines, included, this.dependencies, line.include);
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            line = _ref[_j];
            source.push(line);
          }
        }
      }
    }
    result = '';
    for (_k = 0, _len3 = source.length; _k < _len3; _k++) {
      line = source[_k];
      if (typeof line === 'string') {
        result += line + '\n';
      } else {
        result += "#line " + line.num + " " + line.fileno + "\n" + line.text + "\n";
      }
    }
    this.gl.shaderSource(shader, result);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.error(included, file_lines, this.gl.getShaderInfoLog(shader));
    }
    return this;
  };

  Shader.prototype.error = function(files, lines, log) {
    var error, filename, fileno, line, lineno, match;
    match = log.match(/(\d+):(\d+)/);
    fileno = match[1];
    lineno = match[2];
    filename = files[fileno];
    line = lines[filename][(lineno - 1).toString()];
    error = log.replace(/\d+:\d+/, function(value) {
      return "File: " + filename + ", Line: " + lineno;
    });
    throw "" + error + "\n" + line;
  };

  Shader.prototype.attribLoc = function(name) {
    var location;
    location = this.attrib_cache[name];
    if (location === void 0) {
      location = this.attrib_cache[name] = this.gl.getAttribLocation(this.program, name);
      if (location >= 0) this.gl.enableVertexAttribArray(location);
    }
    return location;
  };

  Shader.prototype.use = function() {
    this.gl.useProgram(this.program);
    return this;
  };

  Shader.prototype.loc = function(name) {
    var location;
    location = this.uniform_cache[name];
    if (location === void 0) {
      location = this.uniform_cache[name] = this.gl.getUniformLocation(this.program, name);
    }
    return location;
  };

  Shader.prototype.i = function(name, value) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniform1i(loc, value);
    return this;
  };

  Shader.prototype.f = function(name, value) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniform1f(loc, value);
    return this;
  };

  Shader.prototype.vec2 = function(name, a, b) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniform2f(loc, a, b);
    return this;
  };

  Shader.prototype.vec3 = function(name, a, b, c) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniform2f(loc, a, b, c);
    return this;
  };

  Shader.prototype.vec4 = function(name, a, b, c, e) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniform2f(loc, a, b, c, e);
    return this;
  };

  Shader.prototype.mat4 = function(name, value) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniformMatrix4fv(loc, false, value);
    return this;
  };

  Shader.prototype.mat3 = function(name, value) {
    var loc;
    loc = this.loc(name);
    if (loc) this.gl.uniformMatrix3fv(loc, false, value);
    return this;
  };

  Shader.prototype.draw = function(drawable) {
    return drawable.setPointersForShader(this).draw();
  };

  return Shader;

})();

});
