import { getImageNodeInSelection } from './index'

export default (event: DragEvent) => {
	const node = getImageNodeInSelection()

	if (!node) return false

	const dataTransfer = event.dataTransfer

	if (!dataTransfer) return false

	const img = document.createElement('img')

	img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

	dataTransfer.setData('text/plain', '_')
	dataTransfer.setDragImage(img, 0, 0)

	dataTransfer.setData(
		'application/x-lexical-drag',
		JSON.stringify({
			data: {
				altText: node.__altText,
				caption: node.__caption,
				height: node.__height,
				key: node.getKey(),
				maxWidth: node.__maxWidth,
				showCaption: node.__showCaption,
				src: node.__src,
				width: node.__width
			},
			type: 'image'
		})
	)

	return true
}
