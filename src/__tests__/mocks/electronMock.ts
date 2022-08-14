import Electron from 'electron'

/**
 * Mocked electron objects so that they contain the jest Mock types
 */

export const ipcRenderer = Electron.ipcRenderer as jest.Mocked<typeof Electron.ipcRenderer>

export const contextBridge = Electron.contextBridge as jest.Mocked<typeof Electron.contextBridge>

export const ipcMain = Electron.ipcMain as jest.Mocked<typeof Electron.ipcMain>

export default {
  contextBridge,
  ipcRenderer,
  ipcMain,
}
