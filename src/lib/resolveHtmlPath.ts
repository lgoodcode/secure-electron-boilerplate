import { URL } from 'url'
import { join } from 'path'

export default function resolveHtmlPath(htmlFileName: string) {
	if (process.env.NODE === 'production') {
		return `file://${join(__dirname, htmlFileName)}`
	}

	const url = new URL(`http://localhost:${process.env.PORT}`)
	url.pathname = htmlFileName
	return url.href
}
