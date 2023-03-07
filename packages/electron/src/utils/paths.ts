import { resolve } from 'path'

export const getAppPath = (v: string) => resolve(`../app/dist/${v}`)
export const getPath = (v: string) => resolve(`${process.cwd()}/${v}`)
