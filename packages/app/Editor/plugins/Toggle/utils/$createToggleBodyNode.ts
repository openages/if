import { $applyNodeReplacement } from 'lexical'

import ToggleBodyNode from '../ToggleBodyNode'

export default () => {
	return $applyNodeReplacement(new ToggleBodyNode()) as ToggleBodyNode
}
