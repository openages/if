import { $createTabNode, $insertNodes } from 'lexical'

import { $isSelectionInCode, getTabCommand } from './index'

export default (event: KeyboardEvent) => {
	if (!$isSelectionInCode()) return false
	if (!getTabCommand(event.shiftKey)) return false

	$insertNodes([$createTabNode()])

	event.preventDefault()

	return true
}
