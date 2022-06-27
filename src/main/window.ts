import { BrowserWindow } from 'electron'
import { join } from 'path'
import { srcPreloadPath } from '../../config/paths'
import getAsset from '../lib/getAsset'
import resolveHtmlPath from '../lib/resolveHtmlPath'
import MenuBuilder from './menu'

export let mainWindow: BrowserWindow | null = null
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'

// Debug features like the shortcuts for inspector and dev tools
if (isDev) {
	import('electron-debug').then(({ default: debug, openDevTools }) => {
		debug()
		openDevTools()
	})
}

export const createWindow = async () => {
	mainWindow = new BrowserWindow({
		show: false,
		width: 1024,
		height: 768,
		icon: getAsset('icon.ico'),
		webPreferences: {
			devTools: !isProd,
			preload: isProd
				? join(__dirname, '../preload/preload.ts')
				: join(srcPreloadPath, 'preload.dev.js'),
			contextIsolation: true,
			nodeIntegration: false,
			webSecurity: true,
			webviewTag: false,
			nodeIntegrationInWorker: false,
			nodeIntegrationInSubFrames: false,
			allowRunningInsecureContent: false,
			experimentalFeatures: false,
			enableBlinkFeatures: undefined,
		},
	})

	// Load the index.html file. Will either be root of localhost in development
	// or in the src path as a file:// url in production
	mainWindow.loadURL(resolveHtmlPath('index.html'))

	// Build the menu
	new MenuBuilder(mainWindow).buildMenu()

	// When window is ready, check settings and show minimized if needed
	// otherwise show regular window and then check if in devention mode
	// to open the devtools
	mainWindow.on('ready-to-show', () => {
		if (!mainWindow) {
			throw new Error('mainWindow is not defined')
		}

		if (process.env.START_MINIZED) {
			mainWindow.minimize()
		} else {
			mainWindow.show()
		}
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	return mainWindow
}
