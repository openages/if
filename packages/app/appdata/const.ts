import { match } from 'ts-pattern'

export const passphrase = window.__key__() + '123654zxy' + window.__key__()

export const getSort = (v: 'asc' | 'desc' | 'ascend' | 'descend') => {
	if (!v) return null

	return match(v)
		.with('asc', () => 'ascend')
		.with('desc', () => 'descend')
		.with('ascend', () => 'asc')
		.with('descend', () => 'desc')
		.exhaustive()
}

export const autolock_map = {
	'1m': { value: 1, unit: 'minute' },
	'2m': { value: 2, unit: 'minute' },
	'3m': { value: 3, unit: 'minute' },
	'6m': { value: 6, unit: 'minute' },
	'15m': { value: 15, unit: 'minute' },
	'30m': { value: 30, unit: 'minute' },
	'1h': { value: 1, unit: 'hour' },
	'1h30m': { value: 1.5, unit: 'hour' },
	'2h': { value: 2, unit: 'hour' },
	'2h30m': { value: 2.5, unit: 'hour' },
	'3h': { value: 3, unit: 'hour' },
	never: {}
}

export const autolock_options = Object.keys(autolock_map).map(item => ({ label: item, value: item }))
