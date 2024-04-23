import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { Placeholder } from './components'
import styles from './index.css'
import nodes from './nodes'
import { AutoLink, Image, Katex, LinkEditor, Picker, Transform } from './plugins'
import { onError } from './utils'

const Index = () => {
	return (
		<div className={$cx('w_100 relative', styles._local)}>
			<LexicalComposer initialConfig={{ namespace: 'editor', nodes, onError }}>
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					placeholder={<Placeholder />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<Picker />
				<Transform />

				<Image />
				<AutoLink />
				<LinkEditor />
				<Katex />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
