import glob from 'fast-glob'
import { moveSync } from 'fs-extra'
import { resolve } from 'path'

const dts = glob.sync(['dist/**/*.d.ts'])

dts.map((path) => moveSync(path, resolve(path.replace('dist/', '')), { overwrite: true }))