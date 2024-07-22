import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IPropsDataLoader } from './types'

const Index = (props: IPropsDataLoader) => {
	const { collection, setEditor } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		setEditor(editor)

		x.init(collection, id, editor)

		return () => x.off()
	}, [collection, id, editor])

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
