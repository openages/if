import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import { IPropsKatex } from '../types'
import styles from './index.css'
import Model from './model'
import Render from './Render'

const Index = (props: IPropsKatex) => {
	const { value, inline, node_key } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key!)

	useLayoutEffect(() => {
		x.block.init(editor, node_key!, setSelected, clearSelection)

		return () => x.block.off()
	}, [editor, node_key, setSelected, clearSelection])

	useEffect(() => {
		x.block.selected = selected

		if (selected) {
			x.block.ref.classList.add(styles.selected)
		} else {
			x.block.ref.classList.remove(styles.selected)
		}
	}, [selected])

	const onClick = useMemoizedFn(x.onEdit)

	return <Render value={value} inline={inline} onClick={onClick}></Render>
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
