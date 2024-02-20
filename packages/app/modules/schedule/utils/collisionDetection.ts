import type { Schedule } from '@/types'

export default (items: Schedule.CalendarDay, start: number, length: number) => {
	const cover = items.find(item => {
		if (item.start === start) return item
		if (start > item.start && start < item.start + item.length) return item
	})

	if (cover) return false

	const collision = items
		.filter(item => start < item.start && start + length > item.start)
		.sort((a, b) => a.start - b.start)
		.at(0)

	if (collision) return collision.start - start

	return length
}
