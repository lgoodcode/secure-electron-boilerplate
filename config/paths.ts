import { realpathSync } from 'fs'
import { join, resolve } from 'path'

const appDirectory = realpathSync(process.cwd())
const resolveApp = (relativePath: string) => resolve(appDirectory, relativePath)

export const envPath = resolveApp('.env')
export const rootPath = resolveApp('.')
export const nodeModulesPath = resolveApp('node_modules')
export const assetsPath = resolveApp('assets')

export const srcMainPath = resolveApp('src/main')
export const srcMainFile = resolveApp('src/main/main.ts')
export const srcPreloadPath = resolveApp('src/preload')
export const srcPreloadFile = resolveApp('src/preload/index.ts')
export const srcRendererPath = resolveApp('src/renderer')
export const indexHTMLFile = resolveApp('src/renderer/index.html')

export const releasePath = resolveApp('release')
export const packagePath = resolveApp('release/package')
export const buildPath = resolveApp('release/app/build')

export const buildMainFile = join(buildPath, 'main.js')
export const buildPreloadFile = join(buildPath, 'preload.js')
export const buildRendererFile = join(buildPath, 'renderer.js')

export default {
  envPath,
  rootPath,
  nodeModulesPath,
  assetsPath,
  srcMainPath,
  srcMainFile,
  srcPreloadPath,
  srcPreloadFile,
  srcRendererPath,
  indexHTMLFile,
  releasePath,
  packagePath,
  buildPath,
  buildMainFile,
  buildPreloadFile,
  buildRendererFile,
}
