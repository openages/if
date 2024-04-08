import { $createRangeSelection, $setSelection } from 'lexical'

import { INSERT_IMAGE_COMMAND } from '../command'
import { canDropImage, getDragImageData, getDragSelection, getImageNodeInSelection } from './index'

import type { LexicalEditor } from 'lexical'

export default (event: DragEvent, editor: LexicalEditor) => {
	const node = getImageNodeInSelection()

	if (!node) return false

	const data = getDragImageData(event)

	if (!data) return false

	event.preventDefault()

	if (canDropImage(event)) {
		const range = getDragSelection(event)

		node.remove()

		const rangeSelection = $createRangeSelection()

		if (range !== null && range !== undefined) {
			rangeSelection.applyDOMRange(range)
		}

		$setSelection(rangeSelection)

		editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)
	}
	return true
}
