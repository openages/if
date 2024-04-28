import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { useGlobal } from '@/context/app'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { registerCodeHighlighting } from './CodeHighlighter'

const Index = () => {
	const [editor] = useLexicalComposerContext()
	const global = useGlobal()
	const theme = global.setting.theme

	useLayoutEffect(() => {
		return registerCodeHighlighting(editor)
	}, [theme, editor])

	return null
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
