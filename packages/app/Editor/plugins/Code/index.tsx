import { useLayoutEffect } from 'react'

import { registerCodeHighlighting } from '@lexical/code'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

const Index = () => {
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => registerCodeHighlighting(editor), [editor])

	return null
}

export default $app.memo(Index)
