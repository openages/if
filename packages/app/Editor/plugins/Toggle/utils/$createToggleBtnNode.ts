import { $applyNodeReplacement } from 'lexical'

import ToggleBtnNode from '../ToggleBtnNode'

export default () => {
	return $applyNodeReplacement(new ToggleBtnNode()) as ToggleBtnNode
}
