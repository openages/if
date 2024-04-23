import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'

import transformers from '../../transformers'

const Index = () => {
	return <MarkdownShortcutPlugin transformers={transformers} />
}

export default $app.memo(Index)
