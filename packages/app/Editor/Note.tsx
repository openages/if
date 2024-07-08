import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'

import { Placeholder } from './components'
import styles from './index.css'
import nodes from './nodes'
import {
	AutoLink,
	Code,
	CodeActions,
	Count,
	DataLoader,
	Divider,
	Hover,
	Image,
	Katex,
	LinkEditor,
	Mermaid,
	Navigation,
	Options,
	Picker,
	Quote,
	Ref,
	Settings,
	Table,
	TableActions,
	TableMerge,
	TableResizer,
	TextBar,
	Toggle,
	Transform,
	Watcher
} from './plugins'
import { style, token } from './theme'
import { onError } from './utils'

const Index = () => {
	return (
		<div className={$cx('__editor_container w_100 relative', styles._local, ...style)}>
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

				<Watcher />
				<DataLoader collection='note_items' />
				<Settings />
				<Hover md />
				<Navigation />
				<Options />
				<Count />
				<Picker />
				<TextBar md />
				<ListPlugin />
				<CheckListPlugin />

				<Image />
				<LinkEditor />
				<Katex />
				<Mermaid />
				<Divider />
				<Code />
				<CodeActions />
				<Toggle />
				<Table />
				<TableActions />
				<TableResizer />
				<TableMerge />
				<Quote />
				<Ref />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
