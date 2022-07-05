/* eslint-disable @typescript-eslint/no-explicit-any */

export type Channels = 'getVideoSources' | 'processVideo'

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				send(channel: Channels, args?: unknown[]): void
				on(channel: Channels, handler: (...args: unknown[]) => void): (() => void) | undefined
				once(channel: Channels, handler: (...args: unknown[]) => void): void
				off(channel: Channels): void
			}
		}
		video: {
			process(ab: ArrayBuffer): void
		}
	}

	namespace Electron {
		interface IpcMain {
			on(channel: Channels, listener: (event: IpcMainEvent, ...args: any[]) => void): this
		}
	}
}
