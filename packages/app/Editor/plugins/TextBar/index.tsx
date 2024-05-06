import { useClickAway } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'

import { Popover } from '@/components'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import styles from './index.css'
import Model from './model'

import type { IPropsCommon } from '@/Editor/types'

const Index = (props: IPropsCommon) => {
	const { markdown } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const ref = useRef()
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(editor, markdown)

		return () => x.off()
	}, [editor, markdown])

	useClickAway(() => x.reset(), [ref])

	return (
		<Popover open={x.visible} position={position}>
			<div className={$cx('flex align_center', styles._local)} ref={ref}>
				123
			</div>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
