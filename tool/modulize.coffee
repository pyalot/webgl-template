cs = require 'coffee-script'
cs.on 'success', (task) ->
    task.output = "define(function(require, exports, module){\n#{task.output}\n});\n"
