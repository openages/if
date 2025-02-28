import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import { IPropsComponent } from '../types'
import styles from './index.css'
import Model from './model'

const Index = (props: IPropsComponent) => {
	const { node_key } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key!)

	useLayoutEffect(() => {
		x.block.init(editor, node_key!, setSelected, clearSelection)

		x.block.ref.className = styles._local

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

	return <span className='w_100'></span>
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
