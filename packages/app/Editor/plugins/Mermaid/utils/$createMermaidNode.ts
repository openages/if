import { $applyNodeReplacement } from 'lexical'

import MermaidNode from '../Node'

import type { IPropsMermaid } from '../types'

export default (args: IPropsMermaid) => {
	return $applyNodeReplacement(new MermaidNode(args)) as MermaidNode
}
