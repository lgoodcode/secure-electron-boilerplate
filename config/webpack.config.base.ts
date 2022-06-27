import type { Configuration } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

const config: Configuration = {
	name: 'base',
	/**
	 * Disables webpack processing of __dirname and __filename.
	 * If you run the bundle in node.js it falls back to these values of node.js.
	 * https://github.com/webpack/webpack/issues/2010
	 */
	node: {
		__dirname: false,
		__filename: false,
	},
	module: {
		rules: [
			// Typescript loader
			{
				test: /\.ts[x]?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
				},
			},
			// Fonts
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			// Images
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	// Speeds up Typescript checking by moving it to another process. By using this,
	// it defaults the `ts-loader` `transpileOnly` option to true.
	plugins: [new ForkTsCheckerWebpackPlugin()],
	resolve: {
		// Specifically points node_modules directory to root
		modules: ['node_modules'],
		// Used to resolve imports
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
	},
	// Cache module dependencies for faster rebuilds
	cache: {
		type: 'filesystem',
	},
}

export default config
