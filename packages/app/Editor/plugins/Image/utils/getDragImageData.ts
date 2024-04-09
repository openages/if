export default (event: DragEvent) => {
	const drag_data = event.dataTransfer?.getData('application/x-lexical-drag')

	if (!drag_data) return null

	const { type, data } = JSON.parse(drag_data)

	if (type !== 'image') return null

	return data
}
