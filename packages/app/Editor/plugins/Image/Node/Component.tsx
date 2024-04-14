import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'

import { IPropsImage } from '../types'
import Model from './model'

const Index = (props: IPropsImage) => {
	const { src, width = '100%', height, alt, node_key } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key)

	useLayoutEffect(() => {
		x.init(editor, setSelected, clearSelection)

		return () => x.off()
	}, [editor, setSelected, clearSelection])

	useEffect(() => {
		x.selected = selected
	}, [selected])

	const setRef = useMemoizedFn(v => (x.ref = v))

	return (
		<div className='flex flex_column'>
			<div draggable={x.draggable}>
				<img src={src} style={{ width, height }} alt={alt} draggable='false' ref={v => setRef(v)} />
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
