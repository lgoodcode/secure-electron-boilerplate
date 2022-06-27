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
export const srcPreloadFile = resolveApp('src/preload/preload.ts')
export const srcRendererPath = resolveApp('src/renderer')
export const indexHTMLFile = resolveApp('src/renderer/index.html')

export const releasePath = resolveApp('release')
export const packagePath = resolveApp('release/package')
export const buildPath = resolveApp('release/build')

export const buildMainPath = join(buildPath, 'main')
export const buildMainFile = join(buildMainPath, 'main.js')
export const buildRendererPath = join(buildPath, 'renderer')
export const buildRendererFile = join(buildRendererPath, 'renderer.js')

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
	buildMainPath,
	buildMainFile,
	buildRendererPath,
	buildRendererFile,
}
