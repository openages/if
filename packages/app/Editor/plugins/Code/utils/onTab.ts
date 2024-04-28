import { $createTabNode, $insertNodes } from 'lexical'

import { getTabCommand } from './index'

export default (event: KeyboardEvent) => {
	if (!getTabCommand(event.shiftKey)) return false

	$insertNodes([$createTabNode()])

	event.preventDefault()

	return true
}
