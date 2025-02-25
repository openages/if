import { useState } from 'react'

import { useCreateLayoutEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IPropsTextLoader } from './types'

const Index = (props: IPropsTextLoader) => {
	const { max_length, linebreak, onChange, setEditor, onKeyDown, onFocus } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useCreateLayoutEffect(() => {
		setEditor(editor)

		x.init(editor, max_length!, linebreak!, onChange, onKeyDown, onFocus)

		return () => x.off()
	}, [editor, max_length, linebreak, onChange, setEditor, onKeyDown, onFocus])

	return null
}

export default $app.memo(Index)
