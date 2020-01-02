#!/usr/bin/env node

/* eslint-env node */
'use strict';

var fs = require('fs');
var path = require('path');

var root = process.argv[2];
var output = process.argv[3];
var configName = 'mk.json';

var markdownInclude = require('../markdown-include');

var Jsons = [];

function read(root) {
	var urls = {};
	var files = fs.readdirSync(root);
	files.forEach((file) => {
		var url = path.join(root, file);
		var isConfig = url.lastIndexOf(configName) > -1;
		var stat = fs.lstatSync(url);
		if (stat.isDirectory()) {
			read(url);
		}
		if (isConfig) {
			var config = require(url);
			var isInclude = config.isInclude;
			var index = config.index;
			url = url.replace(file, index);
			if (isInclude) {
				Jsons.push({
					build: "index2.md",
					files: [url]
				});
			}
		}
	});
}

read(root);

markdownInclude.compileFiles(Jsons[0]).then(function () {
	console.info(markdownInclude.options.build + ' have been built successfully');
});

// 约定目录和配置文件