import { $applyNodeReplacement } from 'lexical'

import KatexNode from '../Node'

import type { IPropsCode } from '../types'

export default (args: IPropsCode) => {
	return $applyNodeReplacement(new KatexNode(args)) as KatexNode
}
