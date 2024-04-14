import { $applyNodeReplacement } from 'lexical'

import ImageNode from '../Node'

import type { ImagePayload } from '../Node'

export default (args: ImagePayload) => {
	const { altText, height, maxWidth = 500, captionsEnabled, src, width, showCaption, caption, key } = args

	return $applyNodeReplacement(
		new ImageNode(src, altText, maxWidth, width, height, showCaption, caption, captionsEnabled, key)
	)
}
