current = null

resolveInclude = (file_lines, included, dependencies, name) ->
    dependency = dependencies[name]
    if included.indexOf(dependency.name) == -1
        result = []
        fileno = included.length
        included.push(dependency.name)
        file_lines[dependency.name] = {}
        for line in dependency.source
            if line.text
                file_lines[dependency.name][line.num] = line.text
                result.push({num: line.num, text: line.text, fileno: fileno})
            else
                for line in resolveInclude(file_lines, included, dependency.dependencies, line.include)
                    result.push(line)
        return result
    else
        return []

exports.Shader = class Shader
    constructor: (@gl, params, @dependencies) ->
        @name       = params.name
        @lines      = params.lines

        @program    = @gl.createProgram()
        @vs         = @gl.createShader gl.VERTEX_SHADER
        @fs         = @gl.createShader gl.FRAGMENT_SHADER

        @gl.attachShader @program, @vs
        @gl.attachShader @program, @fs

        @link params.vertex, params.fragment

    link: (vertex, fragment) ->
        @compile @vs, vertex
        @compile @fs, fragment
        @gl.linkProgram @program

        if not @gl.getProgramParameter @program, @gl.LINK_STATUS
            throw @gl.getProgramInfoLog

        @attrib_cache = {}
        @uniform_cache = {}
        return @
            
    compile: (shader, lines) ->
        source = []
        included = [@name]
        file_lines = {}
        file_lines[@name] = {}
        for line in lines
            if typeof(line) == 'string'
                source.push(line)
            else
                if line.text
                    file_lines[@name][line.num] = line.text
                    source.push({num: line.num, text: line.text, fileno: 0})
                else
                    for line in resolveInclude(file_lines, included, @dependencies, line.include)
                        source.push(line)

        result = ''
        for line in source
            if typeof(line) == 'string'
                result += line + '\n'
            else
                result += "#line #{line.num} #{line.fileno}\n#{line.text}\n"

        @gl.shaderSource shader, result
        @gl.compileShader shader

        if not @gl.getShaderParameter shader, @gl.COMPILE_STATUS
            @error included, file_lines, @gl.getShaderInfoLog(shader)
        return @

    error: (files, lines, log) ->
        match = log.match /(\d+):(\d+)/
        fileno = match[1]
        lineno = match[2]
        filename = files[fileno]
        line = lines[filename][(lineno-1).toString()]
        error = log.replace /\d+:\d+/, (value) ->
            "File: #{filename}, Line: #{lineno}"
        throw "#{error}\n#{line}"

    attribLoc: (name) ->
        location = @attrib_cache[name]
        if location is undefined
            location = @attrib_cache[name] = @gl.getAttribLocation @program, name
            @gl.enableVertexAttribArray location if location >= 0
        return location

    use: ->
        @gl.useProgram @program
        return @

    loc: (name) ->
        location = @uniform_cache[name]
        if location is undefined
            location = @uniform_cache[name] = @gl.getUniformLocation @program, name
        return location

    i: (name, value) ->
        loc = @loc name
        @gl.uniform1i loc, value if loc
        return @

    f: (name, value) ->
        loc = @loc name
        @gl.uniform1f loc, value if loc
        return @
    
    vec2: (name, a, b) ->
        loc = @loc name
        @gl.uniform2f loc, a, b if loc
        return @
    
    vec3: (name, a, b, c) ->
        loc = @loc name
        @gl.uniform2f loc, a, b, c if loc
        return @
    
    vec4: (name, a, b, c, e) ->
        loc = @loc name
        @gl.uniform2f loc, a, b, c, e if loc
        return @

    mat4: (name, value) ->
        loc = @loc name
        @gl.uniformMatrix4fv loc, false, value if loc
        return @

    mat3: (name, value) ->
        loc = @loc name
        @gl.uniformMatrix3fv loc, false, value if loc
        return @

    draw: (drawable) ->
        drawable.setPointersForShader(@).draw()
