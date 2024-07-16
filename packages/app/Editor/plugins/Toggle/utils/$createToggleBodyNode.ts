import { $applyNodeReplacement } from 'lexical'

import ToggleBodyNode from '../ToggleBodyNode'

export default (key?: string) => {
	return $applyNodeReplacement(new ToggleBodyNode(key)) as ToggleBodyNode
}
