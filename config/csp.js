const CSP =
	process.env.NODE_ENV !== 'production'
		? {
				'default-src': "'self' 'unsafe-inline'",
		  }
		: {
				'base-uri': "'self'",
				'object-src': "'none'",
				'img-src': "'self' data:",
				'script-src': "'self'",
				'style-src': "'self' file:",
				'frame-src': "'none'",
				'worker-src': "'none'",
		  }

export default CSP
