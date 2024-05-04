import {
	COMMAND_PRIORITY_LOW,
	INDENT_CONTENT_COMMAND,
	KEY_ARROW_DOWN_COMMAND,
	KEY_ARROW_UP_COMMAND,
	KEY_TAB_COMMAND,
	MOVE_TO_END,
	MOVE_TO_START,
	OUTDENT_CONTENT_COMMAND,
	TextNode
} from 'lexical'

import { mergeRegister } from '@lexical/utils'

import CodeNode from '../CodeNode'
import CodeTextNode from '../CodeTextNode'
import {
	onCodeNodeTransform,
	onMoveTo,
	onMultilineIndent,
	onMutation,
	onShiftLines,
	onTab,
	onTextNodeTransform
} from './index'

import type { LexicalEditor } from 'lexical'

export default (editor: LexicalEditor) => {
	return mergeRegister(
		editor.registerMutationListener(CodeNode, mutations => onMutation(editor, mutations)),
		editor.registerNodeTransform(CodeNode, node => onCodeNodeTransform(node, editor)),
		editor.registerNodeTransform(TextNode, node => onTextNodeTransform(node, editor)),
		editor.registerNodeTransform(CodeTextNode, node => onTextNodeTransform(node, editor)),
		editor.registerCommand(KEY_TAB_COMMAND, onTab, COMMAND_PRIORITY_LOW),
		editor.registerCommand(
			INDENT_CONTENT_COMMAND,
			() => onMultilineIndent(INDENT_CONTENT_COMMAND),
			COMMAND_PRIORITY_LOW
		),
		editor.registerCommand(
			OUTDENT_CONTENT_COMMAND,
			() => onMultilineIndent(OUTDENT_CONTENT_COMMAND),
			COMMAND_PRIORITY_LOW
		),
		editor.registerCommand(
			KEY_ARROW_UP_COMMAND,
			payload => onShiftLines(KEY_ARROW_UP_COMMAND, payload),
			COMMAND_PRIORITY_LOW
		),
		editor.registerCommand(
			KEY_ARROW_DOWN_COMMAND,
			payload => onShiftLines(KEY_ARROW_DOWN_COMMAND, payload),
			COMMAND_PRIORITY_LOW
		),
		editor.registerCommand(MOVE_TO_END, payload => onMoveTo(MOVE_TO_END, payload), COMMAND_PRIORITY_LOW),
		editor.registerCommand(MOVE_TO_START, payload => onMoveTo(MOVE_TO_START, payload), COMMAND_PRIORITY_LOW)
	)
}
