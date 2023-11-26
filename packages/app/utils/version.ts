import { version } from '../package.json'

const v = Number(version.replaceAll('.', ''))

export default v
