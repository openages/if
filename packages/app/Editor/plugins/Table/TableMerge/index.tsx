import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ArrowsInLineHorizontal } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)
	}, [id, editor])

	const mergeCells = useMemoizedFn(() => {
		editor.update(() => x.mergeCells())
	})

	if (!x.visible) return null

	const Content = (
		<div
			className={$cx(styles._local, 'border_box flex justify_center align_center fixed clickable')}
			style={{ left: x.style.left, top: x.style.top }}
			onClick={mergeCells}
		>
			<ArrowsInLineHorizontal size={15} />
		</div>
	)

	return createPortal(Content, document.getElementById(id))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
