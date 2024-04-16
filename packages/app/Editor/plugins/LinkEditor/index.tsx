import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { readonly } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		x.init(editor)

		return () => x.off()
	}, [editor])

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
