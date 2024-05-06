import { useClickAway } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import Formats from './Formats'
import Model from './model'

import type { IPropsCommon } from '@/Editor/types'
import type { IPropsFormats } from './types'

const Index = (props: IPropsCommon) => {
	const { md } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(id, editor, md)

		return () => x.off()
	}, [id, editor, md])

	const props_formats: IPropsFormats = {
		md
	}

	return (
		<Popover open={x.visible} position={position} top>
			<Formats {...props_formats}></Formats>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
