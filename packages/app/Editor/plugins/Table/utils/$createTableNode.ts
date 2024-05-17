import { $applyNodeReplacement } from 'lexical'

import TableNode from '../TableNode'

export default () => {
	return $applyNodeReplacement(new TableNode()) as TableNode
}
