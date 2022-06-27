import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import chalk from 'chalk'
import rendererConfig from '../config/webpack.config.renderer'
import checkBuild from './checkBuild'
import '../config/env'
import build from './build'
import runScript from './runScript'

const compiler = webpack(rendererConfig)
const devServerOptions = {
	compress: true,
	hot: true,
	headers: { 'Access-Control-Allow-Origin': '*' },
	static: {
		publicPath: '/',
	},
	historyApiFallback: {
		verbose: true,
	},
}
const server = new WebpackDevServer(devServerOptions, compiler)

const startServer = async () => {
	console.log(chalk.cyan('Checking if the main process and renderer has been built...'))

	if (!(await checkBuild())) {
		console.log(chalk.yellow('Starting the build process...'))
		// If build fails, abort the process
		if (!(await build())) {
			return process.exit(1)
		}
	}

	console.log(chalk.cyan('Starting preload file processing...'))
	runScript('preload', 'npm', ['run', 'start:preload'])

	console.log(chalk.cyan('Starting main process...'))
	runScript('main', 'npm', ['run', 'start:main'])

	console.log(chalk.cyan('Starting renderer server...'))
	await server.start()
}

startServer()
