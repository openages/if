export default (container: HTMLDivElement, step: number, x: number) => {
	if (!container) return

	const container_left = container.getBoundingClientRect().left

	const position = x - container_left - 90
	const start = Math.floor(position / step)

	return start
}
