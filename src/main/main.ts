// Load environment variables first because they can be used in other files
import { app, shell, BrowserWindow, type Event } from 'electron'
import unhandled from 'electron-unhandled'
import isValidOrigin from '../lib/isValidOrigin'
import permissionsHandler from '../lib/permissionsHandler'
import configureCsp from '../lib/configureCsp'
import { createWindow } from './window'
// All main IPC functioning
import './ipcMain'

// Catches uncaught exceptions in packaged app
if (app.isPackaged) {
  unhandled({ showDialog: true })
}

/**
 * 4. Enable process sandboxing
 *
 * Globally enable sandboxing for all renderers.
 *
 * https://www.electronjs.org/docs/latest/tutorial/security#4-enable-process-sandboxing
 */
app.enableSandbox()

/**
 * Prevent multiple instances of the app from running at the same time.
 *
 * If reqestSingleInstanceLock is false, then there is another instance running
 * so we close all windows and will open another instance. Otherwise, we find
 * the other instance then restore and focus it.
 */
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', async () => {
    let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed())

    if (!window) {
      window = await createWindow()
    }

    if (window.isMinimized()) {
      window.restore()
    }
    window.focus()
  })
}

/**
 * Respect the OSX convention of having the application in memory even
 * after all windows have been closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Create window when Electron is initialized and run the security configuration
 * function `permisionHandler` and `configureCSP`.
 */
app
  .whenReady()
  .then(() => {
    createWindow()
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  .then(permissionsHandler)
  .then(configureCsp)
  .catch((err) => console.error('Failed to create window', err))

/**
 * Install devtool extensions for development
 */
if (!app.isPackaged) {
  app.whenReady().then(async function installDevTools() {
    await import('../lib/installExtensions')
  })
}

/**
 * Check for updates when packaged
 */
// if (app.isPackaged) {
//   app.whenReady().then(async function checkForUpdates() {
//     const { autoUpdater } = await import('electron-updater')
//     autoUpdater.checkForUpdatesAndNotify()
//   })
// }

/**
 * Handles rendering and controlling web pages.
 */
app.on('web-contents-created', (_, contents) => {
  /**
   * 12. Verify WebView options before creation
   *
   * https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
   */
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    const parsedURL = new URL(params.src)

    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload

    // Disable Node.js integration
    webPreferences.nodeIntegration = false

    // Verify URL being loaded
    if (!isValidOrigin(parsedURL.origin)) {
      event.preventDefault()
    } else {
      console.error(
        `The application blocked an attempt to create a WebView with an invalid URL: "${parsedURL.href}"`
      )
    }
  })

  /**
   * 13. Limit navigation to external websites
   *
   * If the requested origin is not included in the whitelist origins, block
   * the request, otherwise allow it and open in user's default browser.
   *
   * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
   */
  const navigationHandler = (type: string) => (contentsEvent: Event, url: string) => {
    const parsedUrl = new URL(url)

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (isValidOrigin(parsedUrl.origin)) {
      return shell.openExternal(parsedUrl.href)
    }
    console.error(`The application blocked an attempt to ${type} to an invalid URL: "${parsedUrl}"`)

    contentsEvent.preventDefault()
  }

  contents.on('will-navigate', navigationHandler('navigate'))
  contents.on('will-redirect', navigationHandler('redirect'))

  /**
   * 14. Disable or limit creation of new windows
   *
   * Called before creating a window a new window is requested by the renderer,
   * e.g. by window.open(), a link with target="_blank", shift+clicking on a
   * link, or submitting a form with <form target="_blank">.
   *
   * https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
   */
  contents.setWindowOpenHandler(({ url }) => {
    if (isValidOrigin(url)) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })
})
