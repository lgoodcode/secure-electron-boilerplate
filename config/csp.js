const CSP = {
  'base-uri': "'self'",
  'object-src': "'none'",
  'img-src': "'self' data:",
  // TODO: remove tailwind for final release on template
  'script-src': "'self' https://cdn.tailwindcss.com",
  'style-src': "'self' 'unsafe-inline'",
  'frame-src': "'none'",
  'worker-src': "'none'",
}

export default CSP
