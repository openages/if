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
import { text_nodes } from './nodes'
import { AutoLink, LinkEditor, Picker, Ref, TextBar, TextLoader, Watcher } from './plugins'
import { linebreak_style, text_style, token } from './theme'
import { onError } from './utils'

import type { IPropsText } from './types'

const Index = (props: IPropsText) => {
	const {
		id,
		className,
		placeholder,
		placeholder_classname,
		max_length,
		linebreak,
		show_on_top,
		readonly,
		disable_textbar,
		onChange,
		setEditor,
		onKeyDown,
		onFocus,
		setRef,
		onContextMenu,
		onClick
	} = props

	const props_rich_text = {
		contentEditable: <ContentEditable />,
		text_mode: !linebreak,
		ErrorBoundary: LexicalErrorBoundary
	}

	if (placeholder) {
		props_rich_text['placeholder'] = <Placeholder className={placeholder_classname} placeholder={placeholder} />
	}

	return (
		<div
			id={id}
			className={$cx('w_100 relative', ...text_style, linebreak && linebreak_style, className)}
			ref={setRef}
			onContextMenu={onContextMenu}
			onClick={onClick}
		>
			<LexicalComposer
				initialConfig={{
					namespace: 'editor',
					nodes: text_nodes,
					theme: token,
					editable: !readonly,
					onError
				}}
			>
				<RichTextPlugin {...props_rich_text} />
				<HistoryPlugin />
				<LinkPlugin />
				<ListPlugin />
				<CheckListPlugin />
				<TabIndentationPlugin />

				<Watcher />
				<TextLoader {...{ max_length, linebreak, onChange, setEditor, onKeyDown, onFocus }} />
				<Picker text_mode />

				<If condition={!disable_textbar}>
					<TextBar only_text={!linebreak} />
				</If>

				<AutoLink />
				<LinkEditor show_on_top={show_on_top} />
				<Ref />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
