import chalk from 'chalk'
import rimraf from 'rimraf'
import { relative } from 'path'
import { rootPath, buildPath, packagePath } from '../config/paths'

console.log(
  chalk.yellow(
    `Cleaning build at "${relative(rootPath, buildPath)}" and package at "${relative(
      rootPath,
      packagePath
    )}"...`
  )
)

const clean = async () => {
  await Promise.all([
    new Promise((res) => rimraf(buildPath, res)),
    new Promise((res) => rimraf(packagePath, res)),
  ])
}

if (process.argv.slice(2).includes('--run')) {
  clean()
}

export default clean
