import { match } from 'ts-pattern'

export const getColorByLevel = (v: number) => {
	return match(v)
		.with(1, () => '#C5CAE9')
		.with(2, () => '#4DD0E1')
		.with(3, () => '#FFD54F')
		.with(4, () => '#F44336')
		.otherwise(() => '')
}
