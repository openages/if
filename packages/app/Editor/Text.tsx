import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { Placeholder } from './components'
import styles from './index.css'
import { text_nodes } from './nodes'
import { AutoLink, LinkEditor, Picker, Ref, TextBar, Updater, Watcher } from './plugins'
import { text_style, token } from './theme'
import { onError } from './utils'

import type { IPropsText } from './types'

const Index = (props: IPropsText) => {
	const {
		id,
		className,
		placeholder,
		placeholder_classname,
		max_length,
		show_on_top,
		onChange,
		setEditor,
		onKeyDown,
		setRef
	} = props

	const props_rich_text = {
		contentEditable: <ContentEditable />,
		ErrorBoundary: LexicalErrorBoundary
	}

	if (placeholder) {
		props_rich_text['placeholder'] = <Placeholder className={placeholder_classname} placeholder={placeholder} />
	}

	return (
		<div id={id} className={$cx('w_100 relative', styles._local, ...text_style, className)} ref={setRef}>
			<LexicalComposer initialConfig={{ namespace: 'editor', nodes: text_nodes, theme: token, onError }}>
				<RichTextPlugin {...props_rich_text} />
				<HistoryPlugin />
				<LinkPlugin />

				<Watcher />
				<Updater {...{ max_length, onChange, setEditor, onKeyDown }} />
				<Picker text_mode />
				<TextBar only_text />

				<AutoLink />
				<LinkEditor show_on_top={show_on_top} />
				<Ref />
			</LexicalComposer>
		</div>
	)
}

export default $app.memo(Index)
