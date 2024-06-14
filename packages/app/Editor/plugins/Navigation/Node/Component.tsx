import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'
import { container } from 'tsyringe'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { Empty } from '@phosphor-icons/react'

import styles from './index.css'
import Item from './Item'
import Model from './model'

import type { TableOfContentsEntry } from '@lexical/react/LexicalTableOfContentsPlugin'
const Index = (props: { items: Array<TableOfContentsEntry>; node_key: string }) => {
	const { items, node_key } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key)

	useLayoutEffect(() => {
		x.block.init(editor, node_key, setSelected, clearSelection)

		return () => x.block.off()
	}, [editor, node_key, setSelected, clearSelection])

	useEffect(() => {
		x.block.selected = selected
	}, [selected])

	const max_type_value = useMemo(() => {
		let max = 7

		items.forEach(item => {
			const [, , type] = item
			const type_value = parseInt(type.replace('h', ''))

			if (type_value < max) max = type_value
		})

		return max
	}, [items])

	const scrollIntoEl = useMemoizedFn((node_key: string) => {
		smoothScrollIntoView(editor.getElementByKey(node_key))
	})

	if (!items.length) {
		return (
			<div
				className={$cx(
					'w_100 border_box justify_center align_center',
					styles._local,
					styles.empty,
					x.block.selected && styles.selected
				)}
				onClick={x.block.onClick}
			>
				<Empty size={18}></Empty>
			</div>
		)
	}

	return (
		<div className={$cx(styles._local, x.block.selected && styles.selected)} onClick={x.block.onClick}>
			<ul>
				{items.map(([node_key, text, type]) => (
					<Item {...{ type, text, node_key, max_type_value, scrollIntoEl }} key={node_key}></Item>
				))}
			</ul>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
