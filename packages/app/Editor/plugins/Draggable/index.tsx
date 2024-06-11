import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DotsSixVertical } from '@phosphor-icons/react'

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

	const onDragStart = useMemoizedFn(e => editor.update(() => x.onDragStart(e)))
	const onDragEnd = useMemoizedFn(e => editor.update(() => x.onDragEnd(e)))

	if (!x.visible_handler && !x.visible_line) return null

	const Content = (
		<Fragment>
			{x.visible_handler && (
				<div
					className={$cx(
						'__editor_draggable_handler absolute top_0 left_0 z_index_1000 flex justify_center align_center clickable',
						styles.handler
					)}
					draggable
					onDragStart={onDragStart}
					onDragEnd={onDragEnd}
					style={{ translate: `${x.position_handler.left}px ${x.position_handler.top}px` }}
				>
					<DotsSixVertical size={14} weight='bold' />
				</div>
			)}
			{x.visible_line && (
				<div
					className={$cx(
						'__editor_draggable_line absolute top_0 left_0 z_index_1000 flex align_center',
						styles.line
					)}
					style={{
						width: x.style_line.width,
						translate: `${x.style_line.left}px ${x.style_line.top}px`
					}}
				></div>
			)}
		</Fragment>
	)

	return createPortal(Content, document.querySelector(`#${id} .__editor_container`))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
