import { URL } from 'url'
import { resolve } from 'path'

/**
 * Electron doesn't use the environment variables at runtime. So we define
 * the function at build time.
 */
let resolveHtmlPath: (htmlFileName: string) => string

if (process.env.NODE_ENV === 'development') {
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${process.env.PORT || 8000}`)
    url.pathname = htmlFileName
    return url.href
  }
} else {
  /**
   * When the application is built, the directory is set to the asar file which
   * is contains the files from the release/app/build directory. The directory
   * is set to that and we resolve for full path relative to that path for the
   * index.html file.
   */
  resolveHtmlPath = (htmlFileName: string) => `file://${resolve(__dirname, htmlFileName)}`
}

export default resolveHtmlPath
