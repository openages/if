import { useLayoutEffect } from 'react'

import { registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { HorizontalRuleNode } from '../../transformers'

const transformers = TRANSFORMERS.concat(HorizontalRuleNode)

const Index = () => {
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => registerMarkdownShortcuts(editor, transformers), [editor])

	return null
}

export default $app.memo(Index)
