import { useState } from 'react'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useCreateLayoutEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useCreateLayoutEffect(() => {
		x.init(id, editor)

		return () => x.off()
	}, [id, editor])

	return null
}

export default $app.memo(Index)
