import { $createImageNode } from './index'

export default (domNode: Node) => {
	const img = domNode as HTMLImageElement

	if (img.src.startsWith('file:///')) return null

	const { src, width, height, alt } = img

	return { node: $createImageNode({ src, width, height, alt }) }
}
