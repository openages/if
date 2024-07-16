import { $applyNodeReplacement } from 'lexical'

import ToggleBtnNode from '../ToggleBtnNode'

export default (key?: string) => {
	return $applyNodeReplacement(new ToggleBtnNode(key)) as ToggleBtnNode
}
