# webgl-template

This project is meant as a template to simplify writing
Coffeescript WebGL applications.

Using it as a template, the following features are solved

+ Compiles coffeescript
+ Compiles shaders
+ Resolves coffeescript requires
+ Resolves requires for shaders into scripts
+ Resolves shader includes
+ Shader class tracks line numbers across includes to provide meaningful debug messages
+ Can be started in a watch mode that looks out for file modifications

## EXAMPLE

The project is its own example, start with looking at the Makefile and the src/main.coffee

## USAGE

* clone this project
* open a terminal to the folder and start "make watch"
* edit files in the project and reload in browser

## REQUIRES

* python
* node.js
* coffeescript
