/*
 * @Date: 2022-12-18 15:49:26
 * @Author: liting luz.liting@gmail.com
 * @LastEditors: liting luz.liting@gmail.com
 * @LastEditTime: 2022-12-18 17:58:00
 * @FilePath: /liting-cli/src/index.js
 */
import { program } from 'commander'
import chalk from 'chalk'
import pkgInfo from '../package.json' assert { type: 'json' }

// version
program.version(chalk.greenBright.bold(pkgInfo.version), '-v, --version', 'the current version of liting-cli')

program.parse()
