import { WebFrameMain } from 'electron'

/**
 * Electron doesn't use the environment variables at runtime. So we define
 * the function at build time.
 */
let validateIpcSender: (senderFrame: WebFrameMain) => boolean

if (process.env.NODE_ENV === 'production') {
  validateIpcSender = (senderFrame) => {
    if (new URL(senderFrame.url).protocol !== 'file:') {
      console.error('Invalid IPC sender')
      return false
    }
    return true
  }
} else {
  validateIpcSender = (senderFrame) => {
    if (new URL(senderFrame.url).host !== `localhost:${process.env.PORT || 8000}`) {
      console.error('Invalid IPC sender')
      return false
    }
    return true
  }
}

export default validateIpcSender
