all: watch
watch:
	./lib/maker watch
compile:
	./lib/maker compile
pack:
	./lib/maker pack
clean:
	rm -rf compiled/*
	rm -f run/main.js
