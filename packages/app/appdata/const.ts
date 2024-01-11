import { match } from 'ts-pattern'

export const getSort = (v: 'asc' | 'desc' | 'ascend' | 'descend') => {
	if (!v) return null

	return match(v)
		.with('asc', () => 'ascend')
		.with('desc', () => 'descend')
		.with('ascend', () => 'asc')
		.with('descend', () => 'desc')
		.exhaustive()
}
