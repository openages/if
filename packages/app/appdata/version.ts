import { version } from '@/package.json'

export const main_version = Number(version.split('.')[0])

export const version_map = new Map([[0, 'Davinci']])

export const getVersionName = () => version_map.get(main_version)!

export const getVersion = () => {
	return `${getVersionName()} (${version})`
}

export const version_name = getVersionName()

export { version }
