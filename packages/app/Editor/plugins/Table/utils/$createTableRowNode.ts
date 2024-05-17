import { $applyNodeReplacement } from 'lexical'

import TableRowNode from '../TableRowNode'

export default () => {
	return $applyNodeReplacement(new TableRowNode()) as TableRowNode
}
