import { useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		x.init(editor)

		const off = x.register()

		return () => off()
	}, [editor])

	return null
}

export default $app.memo(Index)
