import { join } from 'path'
import { merge } from 'webpack-merge'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import baseConfig from './webpack.config.base'
import paths from './paths'
import CSP from './csp'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

const rendererConfig: webpack.Configuration = {
	name: 'renderer',
	devtool: isDevelopment
		? 'inline-source-map'
		: process.env.DEBUG_PROD === 'true'
		? 'source-map'
		: false,
	mode: isProduction ? 'production' : 'development',
	bail: isProduction,
	entry: isProduction
		? join(paths.srcRendererPath, 'index.tsx')
		: ['webpack/hot/only-dev-server', join(paths.srcRendererPath, 'index.tsx')],
	target: ['web', 'electron-renderer'],
	stats: isDevelopment ? 'errors-warnings' : 'errors-only',
	output: {
		filename: isProduction ? 'renderer.js' : 'renderer.dev.js',
		path: paths.buildPath,
		publicPath: isDevelopment ? '/' : './',
		library: {
			type: 'umd',
		},
		pathinfo: isDevelopment,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
			},
		],
	},
	optimization: {
		minimize: isProduction,
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
			new CssMinimizerPlugin(),
		],
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		isDevelopment && new ReactRefreshWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: paths.indexHTMLFile,
			minify: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
			},
			isBrowser: false,
			env: isProduction ? 'production' : 'development',
			isDevelopment,
			nodeModules: paths.nodeModulesPath,
		}),
		isProduction &&
			new CspHtmlWebpackPlugin(
				Object.entries(CSP).reduce((acc: Record<string, string[]>, [key, value]) => {
					acc[key] = [value]
					return acc
				}, {}),
				{
					hashEnabled: {
						'style-src': false,
					},
					// TODO: remove this once published as it's only to allow testing
					// TailwindCSS from cdn for production testing
					nonceEnabled: {
						'style-src': false,
					},
				}
			),
	].filter(Boolean) as webpack.WebpackPluginInstance[],
}

export default merge(baseConfig, rendererConfig)
