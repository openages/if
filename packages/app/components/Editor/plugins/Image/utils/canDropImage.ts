export default (event: DragEvent) => {
	const target = event.target

	return !!(
		target &&
		target instanceof HTMLElement &&
		!target.closest('code') &&
		target.parentElement &&
		target.parentElement.closest('div.ContentEditable__root')
	)
}
