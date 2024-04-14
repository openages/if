import { $applyNodeReplacement } from 'lexical'

import ImageNode from '../Node'

import type { IPropsImage } from '../types'

export default (args: IPropsImage) => {
	const { src, width, height, alt, key } = args

	return $applyNodeReplacement(new ImageNode(src, width, height, alt, key))
}
