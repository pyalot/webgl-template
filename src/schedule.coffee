exports.run = (callback) ->
    last = Date.now()
    start = last

    request = window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or (fun) ->
        setTimeout(fun, 1000/30)

    step = ->
        current = Date.now()
        delta = current-last
        last = current
        callback (current-start)/1000, delta/1000
        request step

    request step
