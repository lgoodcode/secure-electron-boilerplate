import chalk from 'chalk'
import rimraf from 'rimraf'
import { relative } from 'path'
import { rootPath, buildPath } from '../config/paths'

console.log(chalk.yellow(`Cleaning build at "${relative(rootPath, buildPath)}"...`))
rimraf.sync(buildPath)
