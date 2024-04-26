import { $applyNodeReplacement } from 'lexical'

import CodeNode from '../Node'

import type { IPropsCode } from '../types'

export default (args: IPropsCode) => {
	return $applyNodeReplacement(new CodeNode(args)) as CodeNode
}
