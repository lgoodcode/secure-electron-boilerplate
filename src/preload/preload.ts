import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels = 'ipc-example' | 'getVideoSources'

contextBridge.exposeInMainWorld('electron', {
	ipcRenderer: {
		send(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args)
		},
		on(channel: Channels, handler: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => handler(...args)
			ipcRenderer.on(channel, subscription)

			return () => ipcRenderer.removeListener(channel, subscription)
		},
		once(channel: Channels, handler: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => handler(...args))
		},
	},
})
