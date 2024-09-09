import { copySync } from 'fs-extra'
import { resolve } from 'path'

copySync(resolve('dist'), resolve('../if_electron/app_dist'))
