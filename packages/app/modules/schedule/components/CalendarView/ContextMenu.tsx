import { useMemoizedFn } from 'ahooks'
import { Item, Menu } from 'react-contexify'

import { Copy, Plus } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCalendarContextMenu } from '../../types'
import type { ItemProps } from 'react-contexify'

const Index = (props: IPropsCalendarContextMenu) => {
	const { container, addTimeBlock } = props

	const onAddTimeBlock: ItemProps['onClick'] = useMemoizedFn(({ props }) => {
		const { index, y } = props

		if (!container.current) return

		const container_top = container.current.getBoundingClientRect().top
		const scroll_top = container.current.scrollTop

		const position = y - container_top + scroll_top
		const start = Math.ceil(position / 16)

		addTimeBlock(index, start)
	})

	return (
		<Menu id='timeblock_context_menu' className={styles.ContextMenu}>
			<Item onClick={onAddTimeBlock}>
				<div className='menu_item flex align_center'>
					<Plus className='icon mr_4' size={16}></Plus>
					<span className='text'>添加</span>
				</div>
			</Item>
			<Item disabled>
				<div className='menu_item flex align_center'>
					<Copy className='icon mr_4' size={16}></Copy>
					<span className='text'>粘贴</span>
				</div>
			</Item>
		</Menu>
	)
}

export default $app.memo(Index)
