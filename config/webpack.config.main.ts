import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import baseConfig from './webpack.config.base'
import paths from './paths'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const isProduction = process.env.NODE_ENV === 'production'

const mainConfig: webpack.Configuration = {
  name: 'main',
  devtool: process.env.DEBUG_PROD === 'true' ? 'source-map' : false,
  mode: isProduction ? 'production' : 'development',
  target: 'electron-main',
  entry: {
    main: paths.srcMainFile,
    preload: paths.srcPreloadFile,
  },
  // Build output
  output: {
    path: paths.buildPath,
    filename: '[name].js',
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        minify: TerserPlugin.swcMinify,
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
