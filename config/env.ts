// import chalk from 'chalk'
import { config as dotenv } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
	dotenv({ path: '.env.development' })
	dotenv({ path: '.env.local' })
}

dotenv()

if (!process.env.PORT) {
	throw new Error(`[env] PORT was not specified. Received: ${process.env.PORT}`)
}

// Used to validate IPC senderFrames in `lib/validateIpcSender.ts` and permissions in
// `lib/permissionsHandler.ts
if (!process.env.HOSTNAME) {
	throw new Error(`[env] HOSTNAME was not specified. Received: ${process.env.HOSTNAME}`)
}
