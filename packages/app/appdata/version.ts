import { version } from '@/package.json'

export const main_version = Number(version.split('.')[0])

export const version_map = new Map([[0, 'Davinci']])

export const getVersion = () => {
	return `${version_map.get(main_version)} (${version}) Beta`
}
