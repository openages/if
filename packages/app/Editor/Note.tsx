import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'

import { Placeholder } from './components'
import styles from './index.css'
import nodes from './nodes'
import { AutoLink, Code, CodeActions, Divider, Image, Katex, LinkEditor, Picker, TextBar, Transform } from './plugins'
import { style, token } from './theme'
import { onError } from './utils'

const Index = () => {
	return (
		<div className={$cx('w_100 relative', styles._local, ...style)}>
			<LexicalComposer initialConfig={{ namespace: 'editor', nodes, theme: token, onError }}>
				<RichTextPlugin
					contentEditable={<ContentEditable />}
					placeholder={<Placeholder />}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<Transform />
				<AutoLink />
				<LinkPlugin />
				<TabIndentationPlugin />

				<Picker />
				<TextBar md />
				<ListPlugin />
				<CheckListPlugin />

				<Image />
				<LinkEditor />
				<Katex />
				<Divider />
				<Code />
				<CodeActions />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
