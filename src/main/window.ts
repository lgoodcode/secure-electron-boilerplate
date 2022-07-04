import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { srcPreloadPath } from '../../config/paths'
import getAsset from '../lib/getAsset'
import resolveHtmlPath from '../lib/resolveHtmlPath'
import MenuBuilder from './menu'

export let mainWindow: BrowserWindow | null = null

// Debug features like the shortcuts for inspector and dev tools.
// The package will ONLY run in development mode, even if explicitly set.
if (!app.isPackaged) {
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
		minWidth: 480,
		minHeight: 640,
		icon: getAsset('icon.ico'),
		webPreferences: {
			// Allow devTools in development or debugging production build
			devTools: !app.isPackaged || process.env.DEBUG_PROD === 'true',
			// When packaged as an electron app, it will look within the asar file,
			// which will contain the files from the release/app/build directory,
			// so we use __dirname to get it relative to that directory.
			preload: app.isPackaged
				? join(__dirname, 'preload.js')
				: join(srcPreloadPath, 'preload.dev.js'),
			// Security features explicitly configured
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

		// Open the devTools for debugging production build
		if (process.env.DEBUG_PROD === 'true') {
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	return mainWindow
}
