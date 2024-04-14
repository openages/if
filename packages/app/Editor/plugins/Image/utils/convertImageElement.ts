import { $createImageNode } from './index'

export default (domNode: Node) => {
	const img = domNode as HTMLImageElement

	if (img.src.startsWith('file:///')) return null

	const { alt: altText, src, width, height } = img

	const node = $createImageNode({ altText, height, src, width })

	return { node }
}
