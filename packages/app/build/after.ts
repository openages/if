import { copySync, removeSync } from 'fs-extra'
import { resolve } from 'path'

removeSync('../if_electron/app_dist')
copySync(resolve('dist'), resolve('../if_electron/app_dist'))
