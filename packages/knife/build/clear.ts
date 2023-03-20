import { rmSync } from 'fs'

rmSync(`${process.cwd()}/dist`, { recursive: true, force: true })
