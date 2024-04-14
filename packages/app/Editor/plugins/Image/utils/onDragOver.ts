import { canDropImage, getImageNodeInSelection } from './index'

export default (event: DragEvent) => {
	const node = getImageNodeInSelection()

	if (!node) return false

	if (!canDropImage(event)) {
		event.preventDefault()
	}

	return true
}
