import { session } from 'electron'

export default function configureCSP() {
	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': [
					"default-src 'none'; connect-src 'self'; object-src 'none'; img-src 'self' data:; script-src 'self'; style-src 'unsafe-inline';",
				],
			},
		})
	})
}
