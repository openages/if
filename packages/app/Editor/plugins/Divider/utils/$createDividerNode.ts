import { $applyNodeReplacement } from 'lexical'

import KatexNode from '../Node'

export default () => {
	return $applyNodeReplacement(new KatexNode()) as KatexNode
}
