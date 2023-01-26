/*
 * @Date: 2022-12-18 15:49:26
 * @Author: liting luz.liting@gmail.com
 * @LastEditors: liting luz.liting@gmail.com
 * @LastEditTime: 2023-01-26 10:53:06
 * @FilePath: /liting-cli/src/index.js
 */
import chalk from 'chalk'
import dgr from 'download-git-repo'
import { camelCase } from 'lodash-es'
import ora from 'ora'
import { execa } from 'execa'
// eslint-disable-next-line prettier/prettier
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

// kill
Commander
  .command('kill [port]')
  .description('kill all processes about the input port')
  .action(async (port) => {
    try {
      const { stdout } = await execa('lsof', [`-i:${port}`])
      console.log(chalk.cyan(stdout), '\n')
      const pids = []
      stdout.split(/\s+/).filter(str => !str.startsWith('(')).forEach((str, i) => {
        if (i > 9 && ((i - 1) % 9 === 0) && !pids.includes(parseInt(str)))
          pids.push(parseInt(str))
      })
      await Inquirer.prompt([{
        type: 'checkbox',
        name: 'pids',
        message: chalk.yellowBright('Please select the pid to kill'),
        choices: pids,
        default: pids,

      }]).then(async (answer) => {
        answer.pids.forEach(async (pid) => {
          await execa('kill', ['-9', pid])
        })
        console.log(chalk.green(`Kill pids ${chalk.greenBright(answer.pids.join(','))} successfully !`))
      })
    }
    catch (err) {
      console.log(chalk.yellow(JSON.parse(JSON.stringify(err, ['message'], 2)).message))
      console.log(chalk.yellow('It is possible that there is no related process for this port'))
    }
  })

Commander.parse()
