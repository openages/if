import { useLayoutEffect } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { register } from './utils'

const Index = () => {
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => register(editor), [editor])

	return null
}

export default $app.memo(Index)
