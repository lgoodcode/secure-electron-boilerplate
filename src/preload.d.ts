import type { Channels } from './preload/preload'

declare global {
	interface Window {
		electron: {
			ipcRenderer: {
				send(channel: Channels, args: unknown[]): void
				on(channel: string, handler: (...args: unknown[]) => void): (() => void) | undefined
				once(channel: string, handler: (...args: unknown[]) => void): void
			}
		}
	}
}

export {}
