import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Formats from './Formats'
import Model from './model'

import type { IPropsCommon } from '@/Editor/types'
import type { IPropsFormats } from './types'

const Index = (props: IPropsCommon) => {
	const { md } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(id, editor, md)

		return () => x.off()
	}, [id, editor, md])

	const props_formats: IPropsFormats = {
		md,
		formats: $copy(x.formats),
		setRef: useMemoizedFn(v => (x.ref = v)),
		onFormat: useMemoizedFn(x.onFormat)
	}

	const updatePosition = useMemoizedFn(x.updatePosition)

	return (
		<Popover open={x.visible} position={position} top updatePosition={updatePosition}>
			<Formats {...props_formats}></Formats>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
