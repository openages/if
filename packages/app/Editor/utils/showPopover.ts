interface Args {
	target_rect: DOMRect | null
	el: HTMLElement
	x_offset?: number
	y_offset?: number
	container?: HTMLElement
}

export default (args: Args) => {
	const { target_rect, el, x_offset = 6, y_offset = 9, container = document.body } = args
	const parent = container.parentElement

	if (target_rect === null || !parent) {
		el.style.opacity = '0'
		el.style.transform = 'translate(-10000px, -10000px)'

		return
	}

	const el_rect = el.getBoundingClientRect()
	const container_rect = container.getBoundingClientRect()
	const parent_rect = parent.getBoundingClientRect()

	let top = target_rect.top - y_offset
	let left = target_rect.left - x_offset

	if (top < parent_rect.top) {
		top += el_rect.height + target_rect.height + y_offset * 2
	}

	if (left + el_rect.width > parent_rect.right) {
		left = parent_rect.right - el_rect.width - x_offset
	}

	top -= container_rect.top
	left -= container_rect.left

	el.style.opacity = '1'
	el.style.transform = `translate(${left}px, ${top}px)`
}
