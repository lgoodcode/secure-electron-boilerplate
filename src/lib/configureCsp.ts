import { session } from 'electron'
import CSP from '../../config/csp'

export default function configureCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': Object.entries(CSP)
          .map(([key, value]) => `${key} ${value}`)
          .join('; '),
      },
    })
  })
}
