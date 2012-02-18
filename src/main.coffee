schedule = require 'schedule'
Display = require './shaders/display'
Cube = require 'webgl/cube'
require 'matrix'

$ ->
    canvas = $('canvas')
    gl = canvas[0].getContext 'experimental-webgl'
    debug = true

    if debug
        gl = WebGLDebugUtils.makeDebugContext gl, (err, name, args) ->
            throw "function: #{name}: #{WebGLDebugUtils.glEnumToString err}"
    
    shader = new Display gl
    cube = new Cube gl, 0.5
    proj = mat4()
    view = mat4()
    model = mat4()

    resize = ->
        width = canvas.width()
        height = canvas.height()

        canvas[0].width = width
        canvas[0].height = height
        gl.viewport 0, 0, width, height
        proj.perspective(60, width/height, 0.1, 10)

    $(window).resize resize
    resize()

    gl.clearColor 0.2, 0.2, 0.2, 1
    gl.enable gl.CULL_FACE

    rotation = 0.0

    schedule (current, delta) ->
        rotation += delta*60 #degrees/s
        view
            .m4identity()
            .m4translate(0, 0, -1)
            .m4rotatex(30)
            .m4rotatey(45)
        model
            .m4identity()
            .m4rotatey(rotation)

        gl.clear gl.COLOR_BUFFER_BIT
        shader
            .use()
            .mat4('proj', proj)
            .mat4('view', view)
            .mat4('model', model)
            .draw(cube)
