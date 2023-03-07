import { app } from 'electron'

const isEnvSet = 'ELECTRON_IS_DEV' in process.env
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV!, 10) === 1

export const is_dev = isEnvSet ? getFromEnv : !app.isPackaged
