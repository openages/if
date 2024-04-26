import { $applyNodeReplacement } from 'lexical'

import TextNode from '../Text'

import type { IPropsText } from '../types'

export default (args: IPropsText) => {
	return $applyNodeReplacement(new TextNode(args)) as TextNode
}
