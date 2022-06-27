import { merge } from 'webpack-merge'
import Webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import baseConfig from './webpack.config.base'
import paths from './paths'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

/**
 * Configuration is only used in production
 */
const mainConfig: Webpack.Configuration = {
	name: 'main',
	devtool: process.env.DEBUG_PROD === 'true' ? 'source-map' : false,
	mode: 'production',
	target: 'electron-main',
	entry: {
		main: paths.srcMainFile,
		preload: paths.srcPreloadFile,
	},
	output: {
		path: paths.buildMainPath,
		filename: '[name].js',
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
		],
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
		}),
	],
}

export default merge(baseConfig, mainConfig)
