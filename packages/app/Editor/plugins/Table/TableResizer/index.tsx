import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import styles from './index.css'
import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)
	}, [id, editor])

	if (!x.visible) return null

	const Content = (
		<div
			className={$cx(styles._local, 'fixed')}
			style={{ left: x.style.left, top: x.style.top, height: x.style.height }}
			ref={v => {
				if (!v) return

				x.addRefListners(v)
			}}
		/>
	)

	return createPortal(Content, document.getElementById(id)!)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
