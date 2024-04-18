import { useClickAway } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'

import { Popover } from '@/components'
import { stopPropagation } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ShareFat } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IProps } from './types'
const Index = (props: IProps) => {
	const {} = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const ref = useRef()
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(editor)

		return () => x.off()
	}, [editor])

	useClickAway(() => x.reset(), [x.dom, ref])

	return (
		<Popover open={x.visible} position={position}>
			<div className={$cx('flex align_center', styles._local)} ref={ref}>
				<input
					className='input_link'
					type='text'
					maxLength={120}
					defaultValue={x.link}
					onKeyDown={stopPropagation}
					onBlur={x.onChange}
				/>
				<a
					className='btn_open flex justify_center align_center clickable'
					target='_blank'
					href={x.link}
				>
					<ShareFat></ShareFat>
				</a>
			</div>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
