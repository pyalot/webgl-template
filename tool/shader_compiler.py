from simplejson import dumps
import re
import sys

sectionre = re.compile('^(\w+):$')
includere = re.compile('^#include "(.+?)"$')

def include(infile, outfile):
    source = open(infile).read()
    lines = source.split('\n')
    type = None
    result = []
    requires = []

    for linenum, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        if line.startswith('//'):
            continue

        section_match = sectionre.match(line)
        include = includere.match(line)
        if include:
            name = include.group(1)
            requires.append(name)
            result.append({'include': name})
        else:
            result.append({'num': linenum, 'text': line})
    
    dependencies = '{%s}' % ','.join(['"%s": require("%s")' % (name, name) for name in requires])
    result = '''
define(function(require, exports, module){
    return ({dependencies: %s, source: %s, name: "%s"});
});
    '''.strip() % (dependencies, dumps(result), infile)
    #result = 'define(%s, data)' % (dumps(requires), dumps(result))

    open(outfile, 'w').write(result)

def program(infile, outfile):
    shaders = {}
            
    directives = [
        'precision highp int;',
        'precision highp float;',
        'precision highp vec2;',
        'precision highp vec3;',
        'precision highp vec4;',
        'precision highp ivec2;',
        'precision highp ivec3;',
        'precision highp ivec4;',
    ]
            
    source = open(infile).read()
    lines = source.split('\n')
    type = None
    types = {None: []}
    requires = []

    for linenum, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        if line.startswith('//'):
            continue

        section_match = sectionre.match(line)
        if section_match:
            type = section_match.group(1)
            types.setdefault(type, [])
        else:
            include = includere.match(line)
            if include:
                name = include.group(1)
                requires.append(name)
                types[type].append({'include': name})
            else:
                types[type].append({'num': linenum, 'text': line})

    common = types[None]
    data = dumps({
        'name': infile, 
        'fragment': directives + common + types['fragment'],
        'vertex': directives + common + types['vertex'],
    })
    requires = '({%s})' % ','.join(['"%s": require("%s")' % (name, name) for name in requires])
    result = '''
define(function(require, exports, module){
    var Shader = require('webgl/shader');
    var dependencies = %s;
    return function(gl){
        return new Shader(gl, %s, dependencies);
    }
})
    '''.strip() % (requires, data)
    open(outfile, 'w').write(result)
