import { join } from 'path'
import paths from '../../config/paths'

const getAsset = (relativePath: string) => join(paths.assetsPath, relativePath)

export default getAsset
