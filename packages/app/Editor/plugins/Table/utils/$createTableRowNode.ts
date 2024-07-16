import { $applyNodeReplacement } from 'lexical'

import TableRowNode from '../TableRowNode'

export default (key?: string) => {
	return $applyNodeReplacement(new TableRowNode(key)) as TableRowNode
}
