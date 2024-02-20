import { useMemoizedFn } from 'ahooks'
import { Item, Menu } from 'react-contexify'

import { Copy, Plus } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCalendarContextMenu } from '../../types'
import type { ItemProps } from 'react-contexify'

const Index = (props: IPropsCalendarContextMenu) => {
	const { view, addTimeBlock } = props

	const onAddTimeBlock: ItemProps['onClick'] = useMemoizedFn(({ props }) => {
		const { index, start, length } = props

		addTimeBlock(view, index, start, length)
	})

	const onHidden = useMemoizedFn((v: boolean) => {
		if (v) return

		$app.Event.emit('schedule/context_menu/hidden')
	})

	return (
		<Menu id='timeblock_context_menu' className={styles.ContextMenu} onVisibilityChange={onHidden}>
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
