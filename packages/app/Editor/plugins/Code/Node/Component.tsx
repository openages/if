import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import styles from './index.css'
import Model from './model'
import Shadow from './Shadow'

import type { IPropsComponent, IPropsShadow, IPropsTextarea } from '../types'

const Index = (props: IPropsComponent) => {
	const { value, lang, node, node_key } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key)
	const wrap = useRef(null)

	useLayoutEffect(() => {
		x.init(editor, node, node_key, setSelected, clearSelection)

		return () => x.unregister()
	}, [editor, node, node_key, setSelected, clearSelection])

	useEffect(() => {
		x.selected = selected
	}, [selected])

	useEffect(() => {
		x.getHighlighter(lang)
	}, [lang])

	useEffect(() => {
		if (!wrap.current) return

		x.createInput(wrap.current)

		return () => x.off()
	}, [])

	useEffect(() => {
		if (x.source === value) return

		x.source = value
		x.input.value = value

		x.render()
	}, [value])

	const props_shadow: IPropsShadow = {
		signal: x.signal_html,
		html: x.html
	}

	const props_textarea: IPropsTextarea = {
		source: x.source,
		onInput: useMemoizedFn(x.onInput),
		onKeyDown: useMemoizedFn(x.onKeyDown)
	}

	return (
		<span className={$cx('flex w_100 relative', styles._local, x.selected && styles.selected)} ref={wrap}>
			<Shadow {...props_shadow}></Shadow>
			{/* <Textarea {...props_textarea}></Textarea> */}
		</span>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
