window.mat4 = ->
    return new Float32Array(16).m4identity()

Float32Array::perspective = (fov, aspect, near, far) ->
    math = Math
    tan = math.tan
    pi = math.PI

    angle = (fov/360)*pi
    top = near * tan(angle)
    bottom = -top
    right = top * aspect
    left = -right

    @[0] = (2*near)/(right-left)
    @[8] = (right+left)/(right-left)
    @[5] = (2*near)/(top-bottom)
    @[9] = (top+bottom)/(top-bottom)
    @[10] = -(far+near)/(far-near)
    @[14] = -(2*far*near)/(far-near)
    @[11] = -1

    return @

Float32Array::m4identity = ->
    @[0]  = 1; @[1]  =0; @[2]  = 0; @[3]  = 0
    @[4]  = 0; @[5]  =1; @[6]  = 0; @[7]  = 0
    @[8]  = 0; @[9]  =0; @[10] = 1; @[11] = 0
    @[12] = 0; @[13] =0; @[14] = 0; @[15] = 1
    return @

Float32Array::m4translate = (x, y, z) ->
    a00 = @[0]; a01 = @[1]; a02 = @[2]; a03 = @[3]
    a10 = @[4]; a11 = @[5]; a12 = @[6]; a13 = @[7]
    a20 = @[8]; a21 = @[9]; a22 = @[10]; a23 = @[11]

    @[12] = a00 * x + a10 * y + a20 * z + @[12]
    @[13] = a01 * x + a11 * y + a21 * z + @[13]
    @[14] = a02 * x + a12 * y + a22 * z + @[14]
    @[15] = a03 * x + a13 * y + a23 * z + @[15]

    return @

Float32Array::m4rotatex = (angle) ->
    math = Math
    sin = math.sin
    cos = math.cos
    tau = 2*math.PI
    rad = tau*(angle/360)
    s = sin rad
    c = cos rad

    a10 = @[4]
    a11 = @[5]
    a12 = @[6]
    a13 = @[7]
    a20 = @[8]
    a21 = @[9]
    a22 = @[10]
    a23 = @[11]

    @[4] = a10 * c + a20 * s
    @[5] = a11 * c + a21 * s
    @[6] = a12 * c + a22 * s
    @[7] = a13 * c + a23 * s

    @[8] = a10 * -s + a20 * c
    @[9] = a11 * -s + a21 * c
    @[10] = a12 * -s + a22 * c
    @[11] = a13 * -s + a23 * c

    return @

Float32Array::m4rotatey = (angle) ->
    math = Math
    sin = math.sin
    cos = math.cos
    tau = 2*math.PI
    rad = tau*(angle/360)
    s = sin rad
    c = cos rad

    a00 = @[0]
    a01 = @[1]
    a02 = @[2]
    a03 = @[3]
    a20 = @[8]
    a21 = @[9]
    a22 = @[10]
    a23 = @[11]

    @[0] = a00 * c + a20 * -s
    @[1] = a01 * c + a21 * -s
    @[2] = a02 * c + a22 * -s
    @[3] = a03 * c + a23 * -s

    @[8] = a00 * s + a20 * c
    @[9] = a01 * s + a21 * c
    @[10] = a02 * s + a22 * c
    @[11] = a03 * s + a23 * c

    return @
