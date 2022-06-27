import chalk from 'chalk'
import { existsSync } from 'fs'
import { buildMainPath, buildRendererPath } from '../config/paths'

/**
 * Checks the build directories which are necessary for the application to run.
 * The `test` parameter is used when running jest to directly invoke the function
 * and throws and error if the directories are not found.
 */
const checkBuild = (test?: boolean) =>
	new Promise<boolean>((res) => {
		if (!existsSync(buildMainPath)) {
			console.log(chalk.red.bold('The main process has not been built yet.'))

			if (test) {
				process.exit(1)
			}
			return res(false)
		}

		if (!existsSync(buildRendererPath)) {
			console.error(chalk.red.bold('The renderer process has not been built yet.'))

			if (test) {
				process.exit(1)
			}
			return res(false)
		}

		res(true)
	})

if (process.env.NODE_ENV === 'test') {
	checkBuild(true)
}

export default checkBuild
