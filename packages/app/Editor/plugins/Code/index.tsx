import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { useLayoutEffect } from 'react'

import { INSERT_CODE_COMMAND } from '@/Editor/commands'
import { getSelectedNode } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'

import { $createCodeNode } from '../Code/utils'
import { register } from './utils'

const Index = () => {
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		return mergeRegister(
			register(editor),
			editor.registerCommand(
				INSERT_CODE_COMMAND,
				_ => {
					const selection = $getSelection()

					if (!$isRangeSelection(selection)) return

					const selected_node = getSelectedNode(selection)

					const node = $createCodeNode({ lang: 'javascript' })

					selected_node.replace(node)

					return true
				},
				COMMAND_PRIORITY_EDITOR
			)
		)
	}, [editor])

	return null
}

export default $app.memo(Index)
