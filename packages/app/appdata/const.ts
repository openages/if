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
	'2m': { value: 2, unit: 'minutes' },
	'3m': { value: 3, unit: 'minutes' },
	'6m': { value: 6, unit: 'minutes' },
	'15m': { value: 15, unit: 'minutes' },
	'30m': { value: 30, unit: 'minutes' },
	'1h': { value: 1, unit: 'hour' },
	'1h30m': { value: 1, unit: 'hour', other: { value: 30, unit: 'minutes' } },
	'2h': { value: 2, unit: 'hours' },
	'2h30m': { value: 2, unit: 'hours', other: { value: 30, unit: 'minutes' } },
	'3h': { value: 3, unit: 'hours' },
	never: {}
}

export const getAutolockOptions = () => {
	return Object.keys(autolock_map).map(key => {
		let label = ''
		const target = autolock_map[key]
		// @ts-ignore
		const getUnit = (unit: string) => $t(`translation:common.time.${unit}`)
		const target_unit = getUnit(target.unit)

		if (key === 'never') return { label: $t('translation:common.never'), value: 'never' }

		if (target.other) {
			const other_unit = getUnit(target.other.unit)

			// @ts-ignore
			label = $t('translation:common.x_y', {
				// @ts-ignore
				x: $t('translation:common.time.x_unit', { x: target.value, unit: target_unit }),
				// @ts-ignore
				y: $t('translation:common.time.x_unit', { x: target.other.value, unit: other_unit })
			})
		} else {
			// @ts-ignore
			label = $t('translation:common.time.x_unit', {
				x: target.value,
				unit: target_unit
			})
		}

		return { label, value: key }
	})
}

export const autolock_value = Object.keys(autolock_map).reduce(
	(target, key) => {
		const item = autolock_map[key]

		if (key === 'never') return (target[key] = 0)

		if (item.other) {
			target[key] = item.value * 60 * 60 * 1000 + item.other.value * 60 * 1000
		} else {
			if (item.unit.indexOf('minute') !== -1) {
				target[key] = item.value * 60 * 1000
			}

			if (item.unit.indexOf('hour') !== -1) {
				target[key] = item.value * 60 * 60 * 1000
			}
		}

		return target
	},
	{} as Record<keyof typeof autolock_map, number>
)

export const getArray = (length: number) => Array.from({ length })

export const PUNCTUATION = [
	',',
	'，',
	'.',
	'。',
	':',
	'：',
	';',
	'；',
	'\\[',
	'\\]',
	'【',
	'】',
	'{',
	'｛',
	'}',
	'｝',
	'(',
	'（',
	')',
	'）',
	'<',
	'《',
	'>',
	'》',
	'$',
	'￥',
	'!',
	'！',
	'\\?',
	'？',
	'~',
	'～',
	"'",
	'’',
	'"',
	'“',
	'”',
	'*',
	'/',
	'\\',
	'&',
	'%',
	'@',
	'#',
	'^',
	'、',
	'、',
	'、',
	'、'
]

export const regex_punctuation = new RegExp(`[${PUNCTUATION.join('')}]`, 'g')
