import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useEditorEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IPropsDataLoader } from './types'

const Index = (props: IPropsDataLoader) => {
	const { collection, setEditor } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useEditorEffect({
		mounted: () => {
			setEditor?.(editor)

			x.init(collection, id, editor)
		},
		unmounted: () => x.off(),
		editor,
		deps: [collection, id, editor]
	})

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
