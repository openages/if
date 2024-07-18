import { useClickAway, useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { stopPropagation } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ShareFat } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IPropsLinkEditor } from './types'

const Index = (props: IPropsLinkEditor) => {
	const { show_on_top } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const ref = useRef()
	const position = $copy(x.position)

	useLayoutEffect(() => {
		x.init(id, editor, show_on_top)

		return () => x.off()
	}, [id, editor, show_on_top])

	useClickAway(() => x.reset(), [x.dom, ref])

	const updatePosition = useMemoizedFn(x.updatePosition)

	return (
		<Popover open={x.visible} position={position} show_on_top={show_on_top} updatePosition={updatePosition}>
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
