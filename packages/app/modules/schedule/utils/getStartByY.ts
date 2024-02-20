import type { MutableRefObject } from 'react'

export default (container: MutableRefObject<HTMLDivElement>, y: number) => {
	if (!container.current) return

	const container_top = container.current.getBoundingClientRect().top
	const scroll_top = container.current.scrollTop

	const position = y - container_top + scroll_top
	const start = Math.floor(position / 16)

	return start
}
