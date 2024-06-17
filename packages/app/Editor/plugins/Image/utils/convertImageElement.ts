import { $createImageNode } from './index'

export default (dom: Node) => {
	const img = dom as HTMLImageElement

	if (img.src.startsWith('file:///')) return null

	const { src, alt } = img

	return { node: $createImageNode({ src, width: 'auto', height: 'auto', alt }) }
}
