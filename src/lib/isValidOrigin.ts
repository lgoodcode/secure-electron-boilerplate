import VALID_ORIGINS from '../../config/allowedOrigins'

const isValidOrigin = (origin: string) => {
  const parsedOrigin = new URL(origin)
  return parsedOrigin.protocol === 'https:' && VALID_ORIGINS.includes(parsedOrigin.origin)
}

export default isValidOrigin
