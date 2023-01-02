import chalk from 'chalk';
import dgr from 'download-git-repo';
import { camelCase } from 'lodash-es';
import ora from 'ora';
import { execa } from 'execa';
import { Command } from 'commander';
import inquirer from 'inquirer';

const name = "liting-cli";
const type = "module";
const version = "0.3.0";
const description = "a dev cli";
const author = "liting-yes <luz.liting@gmail.com>";
const license = "MIT";
const homepage = "https://github.com/dev-standard/liting-cli#readme";
const keywords = [
	"cli",
	"liting"
];
const exports = {
	".": {
		require: "./dist/index.cjs",
		"import": "./dist/index.mjs"
	}
};
const main = "./dist/index.cjs";
const types = "./dist/index.d.ts";
const bin = {
	liting: "./dist/index.mjs"
};
const publishConfig = {
	access: "public",
	registry: "https://registry.npmjs.org"
};
const files = [
	"dist"
];
const scripts = {
	prepare: "husky install",
	commit: "git-cz",
	release: "release-it",
	build: "unbuild",
	format: "eslint --fix ."
};
const dependencies = {
	chalk: "^5.2.0",
	commander: "^9.4.1",
	"download-git-repo": "^3.0.2",
	execa: "^6.1.0",
	inquirer: "8",
	"lodash-es": "^4.17.21",
	ora: "^6.1.2"
};
const devDependencies = {
	"@antfu/eslint-config": "^0.34.0",
	"@commitlint/cli": "^17.3.0",
	"@commitlint/config-conventional": "^17.3.0",
	"@commitlint/cz-commitlint": "^17.3.0",
	"@release-it/conventional-changelog": "^5.1.1",
	commitizen: "^4.2.6",
	eslint: "^8.30.0",
	"eslint-config-prettier": "^8.5.0",
	"eslint-plugin-prettier": "^4.2.1",
	husky: "^8.0.0",
	"lint-staged": "^13.1.0",
	prettier: "^2.8.1",
	"release-it": "^15.5.1",
	unbuild: "^1.0.2"
};
const config = {
	commitizen: {
		path: "@commitlint/cz-commitlint"
	}
};
const pkgInfo = {
	name: name,
	type: type,
	version: version,
	"private": false,
	description: description,
	author: author,
	license: license,
	homepage: homepage,
	keywords: keywords,
	exports: exports,
	main: main,
	types: types,
	bin: bin,
	publishConfig: publishConfig,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	config: config
};

const Commander = new Command();

const Inquirer = inquirer;

const CRATE_TEMPLATE = {
  template: "dev-standard/template"
};

Commander.version(chalk.greenBright.bold(pkgInfo.version), "-v, --version", "the current version of liting-cli");
Commander.command("create [template]").description("create a project from template").action(async (template) => {
  let repo;
  if (Object.keys(CRATE_TEMPLATE).includes(template)) {
    repo = template;
  } else {
    if (template)
      console.log(chalk.red(`Template name ${template} is incorrect`));
    await Inquirer.prompt([{
      type: "list",
      name: "template",
      message: chalk.yellowBright("Please select a template to create"),
      choices: Object.keys(CRATE_TEMPLATE),
      default: Object.keys(CRATE_TEMPLATE)[0]
    }]).then((answer) => {
      repo = answer.template;
    });
  }
  const spinner = ora(chalk.green(`downloading the template ${repo}`)).start();
  dgr(CRATE_TEMPLATE[repo], camelCase(CRATE_TEMPLATE[repo]), (err) => {
    if (err)
      spinner.fail(chalk.red(`download the template ${repo} failed`));
    else
      spinner.succeed(chalk.greenBright(`download the template ${repo} successfully`));
  });
});
Commander.command("kill [port]").description("kill all processes about the input port").action(async (port) => {
  try {
    const { stdout } = await execa("lsof", [`-i:${port}`]);
    console.log(chalk.cyan(stdout), "\n");
    const pids = [];
    stdout.split(/\s+/).filter((str) => !str.startsWith("(")).forEach((str, i) => {
      if (i > 9 && (i - 1) % 9 === 0 && !pids.includes(parseInt(str)))
        pids.push(parseInt(str));
    });
    await Inquirer.prompt([{
      type: "checkbox",
      name: "pids",
      message: chalk.yellowBright("Please select the pid to kill"),
      choices: pids,
      default: pids
    }]).then(async (answer) => {
      answer.pids.forEach(async (pid) => {
        await execa("kill", ["-9", pid]);
      });
      console.log(chalk.green(`Kill pids ${chalk.greenBright(answer.pids.join(","))} successfully !`));
    });
  } catch (err) {
    console.log(chalk.yellow(JSON.parse(JSON.stringify(err, ["message"], 2)).message));
    console.log(chalk.yellow("It is possible that there is no related process for this port"));
  }
});
Commander.parse();
