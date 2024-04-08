import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { Placeholder } from './components'
import styles from './index.css'
import { onError } from './utils'

const Index = () => {
	return (
		<div className={$cx('w_100 relative', styles._local)}>
			<LexicalComposer initialConfig={{ namespace: 'editor', onError }}>
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					placeholder={<Placeholder />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<AutoFocusPlugin />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
