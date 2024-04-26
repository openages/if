import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { useGlobal } from '@/context/app'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Model from './model'

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const global = useGlobal()
	const theme = global.setting.theme

	useLayoutEffect(() => {
		x.init(theme, editor)

		return () => x.off()
	}, [theme, editor])

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
