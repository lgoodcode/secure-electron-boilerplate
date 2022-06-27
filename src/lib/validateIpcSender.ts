import type { WebFrameMain } from 'electron'

const validateIpcSender = (senderFrame: WebFrameMain) =>
	new URL(senderFrame.url).host === `${process.env.HOSTNAME}:${process.env.PORT}`

export default validateIpcSender
