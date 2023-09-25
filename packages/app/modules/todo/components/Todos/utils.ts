export const getRelativePostion = (container: HTMLDivElement, el: HTMLDivElement) => {
	const position_container = container.getBoundingClientRect()
	const position_target = el.getBoundingClientRect()

	return position_target.y - position_container.y
}

export const getLinkedItems = (items: Array<string>) => {
	const result: Array<[string, string]> = []

	for (let i = 0; i < items.length - 1; i++) {
		result.push([items[i], items[i + 1]])
	}

	return result
}
