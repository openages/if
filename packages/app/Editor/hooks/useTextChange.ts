import { parseEditorState } from 'lexical'
import { useState } from 'react'

import { useDeepEffect } from '@/hooks'
import { deepEqual } from '@openages/stk/react'

import { $getEditorSize } from '../utils'

import type { RefObject } from 'react'
import type { LexicalEditor } from 'lexical'

interface Args {
	ref_editor: RefObject<LexicalEditor | undefined>
	text: string
}

export default (args: Args) => {
	const { ref_editor, text } = args
	const [editor_size, setEditorSize] = useState(0)

	useDeepEffect(() => {
		const editor = ref_editor.current

		if (!editor || !text) return

		const editor_state = JSON.stringify(editor.getEditorState().toJSON())

		if (deepEqual(text, editor_state)) return

		editor.setEditorState(parseEditorState(JSON.parse(text), editor))

		setEditorSize($getEditorSize(editor))
	}, [text])

	return { editor_size }
}
