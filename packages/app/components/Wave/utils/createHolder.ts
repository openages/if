export default (node: HTMLElement) => {
	const { borderWidth } = getComputedStyle(node)
	const borderWidthNum = parseInt(borderWidth, 10)

	const div = document.createElement('div')

	div.style.position = 'absolute'
	div.style.inset = `-${borderWidthNum}px`
	div.style.borderRadius = 'inherit'
	div.style.background = 'transparent'
	div.style.zIndex = '999'
	div.style.pointerEvents = 'none'
	div.style.overflow = 'hidden'

	node.appendChild(div)

	return div
}
