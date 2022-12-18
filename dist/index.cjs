'use strict';

const commander = require('commander');

const name = "liting-cli";
const type = "module";
const version = "0.0.0";
const description = "a dev cli";
const bin = {
	liting: "dist/index.cjs"
};
const publishConfig = {
	access: "public",
	registry: "https://registry.npmjs.org"
};
const author = "liting-yes <luz.liting@gmail.com>";
const license = "MIT";
const homepage = "https://github.com/dev-standard/liting-cli#readme";
const keywords = [
	"cli",
	"frontend",
	"liting"
];
const exports$1 = {
	".": {
		require: "./dist/index.cjs",
		"import": "./dist/index.mjs"
	}
};
const main = "./dist/index.cjs";
const types = "./dist/index.d.ts";
const files = [
	"dist"
];
const scripts = {
	prepare: "husky install",
	commit: "git-cz",
	release: "release-it",
	build: "unbuild",
	format: "eslint --fix"
};
const devDependencies = {
	"@antfu/eslint-config": "^0.34.0",
	"@commitlint/cli": "^17.3.0",
	"@commitlint/config-conventional": "^17.3.0",
	"@commitlint/cz-commitlint": "^17.3.0",
	"@release-it/conventional-changelog": "^5.1.1",
	commitizen: "^4.2.6",
	eslint: "^8.30.0",
	husky: "^8.0.0",
	inquirer: "^8.2.5",
	"lint-staged": "^13.1.0",
	"release-it": "^15.5.1",
	unbuild: "^1.0.2"
};
const config = {
	commitizen: {
		path: "@commitlint/cz-commitlint"
	}
};
const dependencies = {
	chalk: "^5.2.0",
	commander: "^9.4.1",
	"download-git-repo": "^3.0.2",
	ora: "^6.1.2"
};
const pkgInfo = {
	name: name,
	type: type,
	version: version,
	"private": false,
	description: description,
	bin: bin,
	publishConfig: publishConfig,
	author: author,
	license: license,
	homepage: homepage,
	keywords: keywords,
	exports: exports$1,
	main: main,
	types: types,
	files: files,
	scripts: scripts,
	devDependencies: devDependencies,
	config: config,
	dependencies: dependencies
};

commander.program.version(pkgInfo, "-v, --version", "the current version of liting-cli");
commander.program.parse();
