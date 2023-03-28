import { useMemoizedFn } from 'ahooks'
import { Else, If, Then, When } from 'react-if'

import { CaretRight } from '@phosphor-icons/react'

import LeftIcon from '../../LeftIcon'

import type { IPropsDirItem_Item } from '../../../types'

const Index = (props: IPropsDirItem_Item) => {
	const { module, item, current_item, parent_index = [], open, showDirTreeOptions, onItem } = props
	const { id, name, type } = item

	const onClick = useMemoizedFn(() => {
		if (type === 'dir') return onItem()

		onItem(id)
	})

	return (
		<div
			className={$cx(
				'item_wrap w_100 border_box flex align_center relative transition_normal cursor_point',
				type === 'file' && current_item === id && 'active'
			)}
			onClick={onClick}
			onContextMenu={(e) => showDirTreeOptions(e, item)}
			style={{ paddingLeft: 18 * parent_index.length }}
		>
			<div className='left_icon_wrap flex justify_center align_center'>
				<If condition={item.icon}>
					<Then>
						<em-emoji shortcodes={item.icon} size='18px'></em-emoji>
					</Then>
					<Else>
						<LeftIcon module={module} item={item}></LeftIcon>
					</Else>
				</If>
			</div>
			<span className={$cx('title_wrap')}>{name}</span>
			<span
				className={$cx(
					'right_icon_wrap flex align_center justify_end',
					type === 'dir' && item.children.length === 0 && 'no_children'
				)}
			>
				<When condition={type === 'dir'}>
					<CaretRight
						className={$cx('icon_fold transition_normal', open && 'opened')}
						size={14}
						weight='bold'
					/>
				</When>
			</span>
		</div>
	)
}

export default $app.memo(Index)
