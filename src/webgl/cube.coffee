exports.Cube = class
    float_size = Float32Array.BYTES_PER_ELEMENT
    position_off = 0
    normal_off = 3
    stride = 6*float_size

    constructor: (@gl, size) ->
        s = size or 1
        vertices = [
            -s, -s, -s,  0,  0, -1,    -s,  s, -s,  0,  0, -1,   s,  s, -s,  0,  0, -1,
             s, -s, -s,  0,  0, -1,    -s, -s, -s,  0,  0, -1,   s,  s, -s,  0,  0, -1,
                                                    
             s,  s,  s,  0,  0,  1,    -s,  s,  s,  0,  0,  1,  -s, -s,  s,  0,  0,  1,
             s,  s,  s,  0,  0,  1,    -s, -s,  s,  0,  0,  1,   s, -s,  s,  0,  0,  1,
                                                    
            -s,  s, -s,  0,  1,  0,    -s,  s,  s,  0,  1,  0,   s,  s,  s,  0,  1,  0,
             s,  s, -s,  0,  1,  0,    -s,  s, -s,  0,  1,  0,   s,  s,  s,  0,  1,  0,
                                                    
             s, -s,  s,  0, -1,  0,    -s, -s,  s,  0, -1,  0,  -s, -s, -s,  0, -1,  0,
             s, -s,  s,  0, -1,  0,    -s, -s, -s,  0, -1,  0,   s, -s, -s,  0, -1,  0,
                                         
            -s, -s, -s, -1,  0,  0,    -s, -s,  s, -1,  0,  0,  -s,  s,  s, -1,  0,  0,
            -s,  s, -s, -1,  0,  0,    -s, -s, -s, -1,  0,  0,  -s,  s,  s, -1,  0,  0,
                                         
             s,  s,  s,  1,  0,  0,     s, -s,  s,  1,  0,  0,   s, -s, -s,  1,  0,  0,
             s,  s,  s,  1,  0,  0,     s, -s, -s,  1,  0,  0,   s,  s, -s,  1,  0,  0,
        ]

        data = new Float32Array vertices
        @buffer = @gl.createBuffer()
        @gl.bindBuffer @gl.ARRAY_BUFFER, @buffer
        @gl.bufferData @gl.ARRAY_BUFFER, data, @gl.STATIC_DRAW
        @gl.bindBuffer @gl.ARRAY_BUFFER, null

    setPointer: (name, size, start, shader) ->
        location = shader.attribLoc name
        if location >= 0
            @gl.vertexAttribPointer location, size, @gl.FLOAT, false, stride, start*float_size
        return @

    setPointersForShader: (shader) ->
        @gl.bindBuffer @gl.ARRAY_BUFFER, @buffer
        @setPointer 'position', 3, position_off, shader
        @setPointer 'normal', 3, normal_off, shader

        return @
    
    draw: (shader) ->
        if shader
            setPointersForShader shader
        @gl.drawArrays @gl.TRIANGLES, 0, 6*2*3
        return @
