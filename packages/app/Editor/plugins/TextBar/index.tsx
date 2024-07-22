import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Formats from './Formats'
import Model from './model'

import type { IPropsFormats, IPropsTextBar } from './types'

const Index = (props: IPropsTextBar) => {
	const { md, only_text } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(id, editor, md)

		return () => x.off()
	}, [id, editor, md])

	useEffect(() => {
		if (x.visible) {
			x.addClickListener()
			x.addBlurListener()
		} else {
			x.removeClickListener()
			x.removeBlurListener()
		}
	}, [x.visible])

	const props_formats: IPropsFormats = {
		md,
		only_text,
		heading_type: x.heading_type,
		list_type: x.list_type,
		formats: $copy(x.formats),
		setRef: useMemoizedFn(v => (x.ref = v)),
		onFormat: useMemoizedFn(x.onFormat)
	}

	const updatePosition = useMemoizedFn(x.updatePosition)

	return (
		<Popover open={x.visible} position={position} top z_index={3000} updatePosition={updatePosition}>
			<Formats {...props_formats}></Formats>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
