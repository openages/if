export const is_mac_electron = window.$shell?.platform === 'darwin' && window.$shell?.type === 'electron'
export const is_dev = process.env.NODE_ENV === 'development'
export const is_prod = process.env.NODE_ENV === 'production'
