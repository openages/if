import { getDomSelection } from '@/Editor/utils'

export default (event: DragEvent) => {
	let range = null
	let target = null as Element | Document | Window

	if (event.target) {
		if ((target as Document).nodeType === 9) {
			target = (target as Document).defaultView
		} else {
			target = (target as Element).ownerDocument.defaultView
		}
	}

	const domSelection = getDomSelection(target as Document | Window)

	if (document.caretRangeFromPoint) {
		range = document.caretRangeFromPoint(event.clientX, event.clientY)
	} else if (event.rangeParent && domSelection !== null) {
		domSelection.collapse(event.rangeParent, event.rangeOffset || 0)

		range = domSelection.getRangeAt(0)
	} else {
		throw Error(`Cannot get the selection when dragging`)
	}

	return range
}
