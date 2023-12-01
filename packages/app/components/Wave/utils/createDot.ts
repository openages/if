export default (holder: HTMLElement, color: string, left: number, top: number, size: number = 0) => {
	const dot = document.createElement('div')

	dot.style.position = 'absolute'
	dot.style.left = `${left}px`
	dot.style.top = `${top}px`
	dot.style.width = `${size}px`
	dot.style.height = `${size}px`
	dot.style.borderRadius = '50%'
	dot.style.background = color
	dot.style.transform = 'translate(-50%, -50%)'
	dot.style.transition = `all 1s ease-out`

	holder.appendChild(dot)

	return dot
}
