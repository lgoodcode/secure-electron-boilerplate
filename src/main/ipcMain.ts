import { ipcMain } from 'electron'
import validateIpcSender from '../lib/validateIpcSender'

/**
 * Inter-process communication
 *
 * Used to communicate between the renderer process and the main process
 *
 * It is recommended to use `reply` to send a response to the renderer process
 * to ensure that it is sent to the proper sender.
 */
ipcMain.once('ipc-example', async (event) => {
	if (validateIpcSender(event.senderFrame)) {
		event.reply('ipc-example', 'pong')
	}
})

ipcMain.on('click', async (event) => {
	if (validateIpcSender(event.senderFrame)) {
		event.reply('click', 'clicked')
	}
})
