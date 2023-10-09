import to from 'await-to-js'
import ntry from 'nice-try'

export const getCursorPosition = (el: HTMLDivElement) => {
	const selection = window.getSelection()
	const range = selection.getRangeAt(0)
	const preSelectionRange = range.cloneRange()

	preSelectionRange.selectNodeContents(el)
	preSelectionRange.setEnd(range.startContainer, range.startOffset)

	const start = preSelectionRange.toString().length

	return start
}

export const setCursorPosition = (el: HTMLDivElement, start: number) => {
	const range = document.createRange()
      const selection = window.getSelection()
      
	range.setStart(el.firstChild, start > el.innerText.length ? el.innerText.length : start)
	range.collapse(true)

	selection.removeAllRanges()
	selection.addRange(range)
}
