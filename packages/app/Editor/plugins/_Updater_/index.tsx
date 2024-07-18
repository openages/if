import { useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IPropsUpdater } from './types'

const Index = (props: IPropsUpdater) => {
	const { max_length, onChange, setEditor, onKeyDown } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		setEditor(editor)

		x.init(editor, max_length, onChange, onKeyDown)

		return () => x.off()
	}, [editor, max_length, onChange, setEditor, onKeyDown])

	return null
}

export default $app.memo(Index)
