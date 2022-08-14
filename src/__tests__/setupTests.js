// Used for testing front-end components
import '@testing-library/jest-dom'

/**
 * Need to mock the electron module for calls because it isn't initalized during
 * the tests and will return `undefined` otherwise
 */
jest.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld: jest.fn(),
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn(),
  },
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    send: jest.fn(),
    off: jest.fn(),
  },
}))

window.ipcRenderer = {
  invoke: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  send: jest.fn(),
  off: jest.fn(),
}
