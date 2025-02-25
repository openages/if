import { useState } from 'react'
import { container } from 'tsyringe'

import { useCreateLayoutEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()

	useCreateLayoutEffect(() => {
		x.init(editor)

		return () => x.off()
	}, [editor])

	return null
}

export default $app.memo(Index)
