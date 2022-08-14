import { config as dotenv } from 'dotenv'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import chalk from 'chalk'
import runScript from './runScript'
import rendererConfig from '../config/webpack.config.renderer'

dotenv({ path: '.env.local' })

const compiler = webpack(rendererConfig)
const devServerOptions: WebpackDevServer.Configuration = {
  host: 'localhost',
  hot: true,
  compress: true,
  port: process.env.PORT || 8000,
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
  console.log(chalk.cyan('Starting preload file processing...'))
  runScript('preload', 'npm', ['run', 'dev:preload'])

  console.log(chalk.cyan('Starting main process...'))
  runScript('main', 'npm', ['run', 'dev:main'])

  console.log(chalk.cyan('Starting renderer server...'))
  await server.start()
}

startServer()
