import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { IPropsComponent } from '../types'
import Model from './model'
import Render from './Render'

const Index = (props: IPropsComponent) => {
	const { value, inline, node, node_key } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()

	useLayoutEffect(() => {
		x.init(editor, node, node_key)
	}, [editor, node, node_key])

	const onClick = useMemoizedFn(x.onClick)

	return <Render value={value} inline={inline} onClick={onClick}></Render>
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
