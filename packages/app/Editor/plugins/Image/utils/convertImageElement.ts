import { $createImageNode } from './index'

export default (domNode: Node) => {
	const img = domNode as HTMLImageElement

	if (img.src.startsWith('file:///')) return null

	const { alt: alt, src, width, height } = img

	const node = $createImageNode({ alt, height, src, width })

	return { node }
}
