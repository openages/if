import { parseEditorState } from 'lexical'
import { useState } from 'react'

import { useDeepEffect } from '@/hooks'
import { deepEqual } from '@openages/stk/react'

import { $getEditorSize } from '../utils'

import type { MutableRefObject } from 'react'
import type { LexicalEditor } from 'lexical'

interface Args {
	ref_editor: MutableRefObject<LexicalEditor>
	text: string
}

export default (args: Args) => {
	const { ref_editor, text } = args
	const [editor_size, setEditorSize] = useState(0)

	useDeepEffect(() => {
		const editor = ref_editor.current

		if (!editor || !text) return

		const new_state = JSON.parse(text)
		const editor_state = editor.getEditorState().toJSON()

		if (deepEqual(new_state, editor_state)) return

		editor.setEditorState(parseEditorState(new_state, editor))

		setEditorSize($getEditorSize(editor))
	}, [text])

	return { editor_size }
}
