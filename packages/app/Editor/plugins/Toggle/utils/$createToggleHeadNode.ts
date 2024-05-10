import { $applyNodeReplacement } from 'lexical'

import ToggleHeadNode from '../ToggleHeadNode'

export default () => {
	return $applyNodeReplacement(new ToggleHeadNode()) as ToggleHeadNode
}
