import dayjs from 'dayjs'

export const fillTimeText = (v: number) => (v < 10 ? `0${v}` : v)

export const getTime = (v: number) => {
	const target = dayjs.duration(v, 'minute')

	return { hours: fillTimeText(target.hours()), minutes: fillTimeText(target.minutes()) }
}

export const getRotateLinePoints = (x: number, y: number, length: number, deg: number) => {
	const radius = (deg * Math.PI) / 180
	const target_x = x + length * Math.sin(radius)
	const target_y = y - length * Math.cos(radius)

	return [x, y, target_x, target_y]
}
