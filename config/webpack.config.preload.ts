import { merge } from 'webpack-merge'
import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import paths from './paths'
import baseConfig from './webpack.config.base'

/**
 * Configuration is only used in development. In production, it is bundled
 * with the main file.
 */
const preloaderConfig: webpack.Configuration = {
  name: 'preload',
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'electron-preload',
  entry: paths.srcPreloadFile,
  watch: true,
  output: {
    // Compiles in src directory for development use
    path: paths.srcPreloadPath,
    filename: 'preload.dev.js',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),
  ],
}

export default merge(baseConfig, preloaderConfig)
