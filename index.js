#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const args = require('args');
const sass = require('node-sass');
const cssToJss = require('jss-cli').cssToJss;
const prettier = require('prettier');

args
	.option('file', 'Sass file to convert to jss (required)')
	.option('outputFile', 'File to save resulting jss to');

const flags = args.parse(process.argv);

if (!flags.file) {
	args.showHelp();
	process.exit(1);
}

const res = sass.renderSync({
	file: path.resolve(process.cwd(), flags.file)
});

const js = cssToJss({code: res.css.toString('utf-8')});
const styles = js['@global'];

const str = `const styles = ${JSON.stringify(styles)}`;
const formattedStr = prettier.format(str, {singleQuote: true, useTabs: true, parser: 'babel'});

if (flags.outputFile) {
	fs.writeFileSync(path.resolve(process.cwd(), flags.outputFile), formattedStr);
} else {
	console.log(formattedStr);
}
