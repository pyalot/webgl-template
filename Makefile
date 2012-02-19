all: watch
watch:
	./tool/maker watch
compile:
	./tool/maker compile
pack:
	./tool/maker pack
clean:
	rm -rf debug/*
	rm -f packed/main.js
