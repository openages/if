import { match } from 'ts-pattern'

export const getColorByLevel = (v: number) => {
	return match(v)
		.with(2, () => '#607D8B')
		.with(3, () => '#F57C00')
		.with(4, () => '#F44336')
		.otherwise(() => '')
}
