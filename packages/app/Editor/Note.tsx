import convertFromString from '@/Editor/utils/convertFromString'
import getNodesFromText from '@/Editor/utils/getNodesFromText'
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
import { note_nodes } from './nodes'
import {
	AutoLink,
	Clicker,
	Code,
	CodeActions,
	Count,
	Divider,
	Hover,
	Image,
	Katex,
	LinkEditor,
	Mermaid,
	Navigation,
	NoteLoader,
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
import { note_style, token } from './theme'
import { onError } from './utils'

import type { IPropsNote } from './types'

const Index = (props: IPropsNote) => {
	const { id, collection, setEditor } = props

	return (
		<div className={$cx('__editor_container w_100 relative', ...note_style)}>
			<LexicalComposer
				initialConfig={{
					refs: { id, getNodesFromText, convertFromString },
					namespace: 'editor',
					nodes: note_nodes,
					theme: token,
					onError
				}}
			>
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
				<ListPlugin />
				<CheckListPlugin />
				<TabIndentationPlugin />

				<Watcher />
				<Clicker />
				<NoteLoader {...{ collection, setEditor }} />
				<Settings />
				<Hover md />
				<Navigation />
				<Options />
				<Count />
				<Picker />
				<TextBar md />

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
