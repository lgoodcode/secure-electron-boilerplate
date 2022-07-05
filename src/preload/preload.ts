import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { Channels } from 'preload'

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
		off(channel: Channels) {
			ipcRenderer.off(channel, () => null)
		},
	},
})

contextBridge.exposeInMainWorld('video', {
	process(ab: ArrayBuffer) {
		ipcRenderer.send('processVideo', ab)
	},
})
