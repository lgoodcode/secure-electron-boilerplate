/**
 * Need to mock any API exposed from the preload file. And add it directly
 * to the window object. This is because jest doesn't support directly mocking
 * windows properties.
 */
window.electron = {
	ipcRenderer: {
		send: jest.fn(),
		on: jest.fn(),
		once: jest.fn(),
		off: jest.fn,
	},
}
