/*
 * @Date: 2022-12-18 15:49:26
 * @Author: liting luz.liting@gmail.com
 * @LastEditors: liting luz.liting@gmail.com
 * @LastEditTime: 2022-12-19 00:24:35
 * @FilePath: /liting-cli/src/index.js
 */
import chalk from 'chalk'
import dgr from 'download-git-repo'
import { camelCase } from 'lodash-es'
import ora from 'ora'
import pkgInfo from '../package.json' assert { type: 'json' }
import { Commander, Inquirer } from './plugins/index.js'
import { CRATE_TEMPLATE } from './vars.js'

// version
Commander
  .version(chalk.greenBright.bold(pkgInfo.version), '-v, --version', 'the current version of liting-cli')

// create
Commander
  .command('create [template]')
  .description('create a project from template')
  .action(async (template) => {
    let repo
    if (Object.keys(CRATE_TEMPLATE).includes(template)) {
      repo = template
    }
    else {
      if (template)
        // eslint-disable-next-line no-console
        console.log(chalk.red(`Template name ${template} is incorrect`))
      await Inquirer.prompt([{
        type: 'list',
        name: 'template',
        message: chalk.yellowBright('Please select a template to create'),
        choices: Object.keys(CRATE_TEMPLATE),
        default: Object.keys(CRATE_TEMPLATE)[0],

      }]).then((answer) => {
        repo = answer.template
      })
    }

    const spinner = ora(chalk.green(`downloading the template ${repo}`)).start()
    dgr(CRATE_TEMPLATE[repo], camelCase(CRATE_TEMPLATE[repo]), (err) => {
      if (err)
        spinner.fail(chalk.red(`download the template ${repo} failed`))

      else
        spinner.succeed(chalk.greenBright(`download the template ${repo} successfully`))
    })
  })

Commander.parse()
