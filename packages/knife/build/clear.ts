import { rmSync } from 'fs'

import { libs } from './common'

libs.map((item) => rmSync(`${process.cwd()}/${item}`, { recursive: true, force: true }))
