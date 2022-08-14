import chalk from 'chalk'
import { mkdirSync } from 'fs'
import { buildPath, packagePath } from '../config/paths'
import clean from './clean'
import runScript from './runScript'

const build = () =>
  new Promise<boolean>(async (res) => {
    await clean()

    mkdirSync(packagePath)
    mkdirSync(buildPath)

    console.log(chalk.cyan('Building main...'))
    const main = runScript('main', 'npm', ['run', 'build:main'])

    console.log(chalk.cyan('Building renderer...'))
    const renderer = runScript('renderer', 'npm', ['run', 'build:renderer'])

    const done = await Promise.all([main, renderer])
    const success = done.reduce((success, job) => {
      if (!success) return false
      if (job) {
        console.error(chalk.red(`\n${job} build failed`))
        return false
      }
      return true
    }, true)

    if (success) {
      console.log(chalk.green.bold('\nBuild completed successfully'))
    } else {
      console.log(chalk.red.bold('\nThe build process failed.'))
    }

    res(success)
  })

// Manually start the build process when calling it from the command line
if (process.argv.slice(2).includes('--run')) {
  build()
}

export default build
