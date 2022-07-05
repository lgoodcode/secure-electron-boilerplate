import { session } from 'electron'

const allowedPermissions: string[] = ['media']

/**
 * Electron doesn't use the environment variables at runtime. So we define
 * the function at build time.
 */
let verifyUrl: (parsedUrl: URL) => boolean

if (process.env.NODE_ENV === 'production') {
	verifyUrl = (parsedUrl) => /https:|file:/.test(parsedUrl.protocol)
} else {
	verifyUrl = (parsedUrl) =>
		parsedUrl.protocol !== 'https:' ||
		parsedUrl.hostname !== `localhost:${process.env.PORT || 8000}`
}

/**
 * 5. Handle session permission requests from remote content
 *
 * The allowed permissions are whitelisted and if the requested permission is not
 * specified, it is blocked.
 */
export default function permissionsHandler() {
	session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
		const parsedUrl = new URL(webContents.getURL())

		// Verify URL
		if (!verifyUrl(parsedUrl)) {
			return callback(false)
		}

		// Verify permission
		if (allowedPermissions.includes(permission)) {
			callback(true)
		} else {
			console.error(`The application blocked a request permission for "${permission}"`)
			callback(false)
		}
	})
}
