import { match } from 'ts-pattern'

export const getColorByLevel = (v: number) => {
	return match(v)
		.with(1, () => '#C5CAE9')
		.with(2, () => '#4DD0E1')
		.with(3, () => '#FF8F00')
		.with(4, () => '#D32F2F')
		.otherwise(() => '')
}
