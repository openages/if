import { Item, Menu, Submenu } from 'react-contexify'
import { When } from 'react-if'

import { ContextMenuItem } from '@/components'
import { ArrowSquareRight, ListPlus, Pencil, Trash } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsOptions } from '../../types'

const Index = (props: IPropsOptions) => {
	const { focusing_item } = props

	return (
		<Menu className={styles._local} id='dirtree_options' animation='scale'>
			<Item>
				<ContextMenuItem Icon={Pencil} text='重命名'></ContextMenuItem>
			</Item>
			<When condition={focusing_item.type === 'dir'}>
				<Item>
					<ContextMenuItem Icon={ListPlus} text='添加列表'></ContextMenuItem>
				</Item>
				<Submenu label={<ContextMenuItem Icon={ArrowSquareRight} text='移动到'></ContextMenuItem>}>
					<Item>today</Item>
					<Item>plan</Item>
					<Item>ghost plan</Item>
				</Submenu>
			</When>
			<Item>
				<ContextMenuItem className='red' Icon={Trash} text='删除'></ContextMenuItem>
			</Item>
		</Menu>
	)
}

export default $app.memo(Index)
