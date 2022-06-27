import { session } from 'electron'

// Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest
const allowedPermissions: string[] = []

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
		if (
			parsedUrl.protocol !== 'https:' ||
			parsedUrl.hostname !== `${process.env.HOSTNAME}:${process.env.PORT}`
		) {
			return callback(false)
		}

		// Verify permission
		if (allowedPermissions.includes(permission)) {
			callback(true)
		} else {
			console.error(`The application block a request permission for "${permission}"`)
			callback(false)
		}
	})
}
