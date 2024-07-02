import { $applyNodeReplacement } from 'lexical'

import NavigationNode from '../Node'

export default () => {
	return $applyNodeReplacement(new NavigationNode()) as NavigationNode
}
