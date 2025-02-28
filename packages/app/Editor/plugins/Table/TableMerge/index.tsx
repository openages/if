import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ArrowsInLineHorizontal, ArrowsOutLineHorizontal } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)

		return () => x.off()
	}, [id, editor])

	const onClick = useMemoizedFn(() => {
		editor.update(() => {
			if (x.type === 'merge') {
				x.mergeCells()
			} else {
				x.unmergeCells()
			}
		})
	})

	if (!x.type || !x.visible) return null

	const Content = (
		<div
			className={$cx(
				'border_box flex justify_center align_center fixed clickable',
				styles._local,
				x.type === 'unmerge' && styles.unmerge
			)}
			style={{ left: x.style.left, top: x.style.top }}
			onClick={onClick}
		>
			{x.type === 'merge' ? <ArrowsInLineHorizontal size={15} /> : <ArrowsOutLineHorizontal size={10} />}
		</div>
	)

	return createPortal(Content, document.getElementById(id)!)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
