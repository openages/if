import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'
import { Else, If, Then, When } from 'react-if'

import { Wave } from '@/components'
import { CaretRight } from '@phosphor-icons/react'

import LeftIcon from '../../../../LeftIcon'

import type { IPropsDirItem_Item } from '../../../types'
import type { DirTree } from '@/types'

const Index = (props: IPropsDirItem_Item) => {
	const {
		module,
		item,
		current_item,
		focusing_item,
		parent_index = [],
		dragging,
		open,
		showDirTreeOptions,
		onClick
	} = props
	const { id, name, type } = item

	const onItem = useMemoizedFn(() => onClick(id))

	return (
		<Wave>
			<Button
				className={$cx(
					'item_wrap w_100 border_box flex align_center relative cursor_point',
					type === 'file' && current_item === id && 'active',
					focusing_item.id === id && 'focusing',
					dragging && 'dragging'
				)}
				style={{ paddingLeft: 18 * parent_index.length }}
				onClick={onItem}
				onContextMenu={(e) => showDirTreeOptions(e, item)}
			>
				<div className='left_icon_wrap flex justify_center align_center'>
					<If condition={item.icon}>
						<Then>
							<em-emoji shortcodes={item.icon} size='16px'></em-emoji>
						</Then>
						<Else>
							<LeftIcon module={module} item={item}></LeftIcon>
						</Else>
					</If>
				</div>
				<div
					className={$cx(
						'title_wrap flex align_center h_100 text_left',
						type === 'file' && 'is_file'
					)}
				>
					{name}
				</div>
				<When condition={type === 'dir'}>
					<div
						className={$cx(
							'right_icon_wrap flex align_center justify_end',
							type === 'dir' && item.children.length === 0 && 'no_children'
						)}
					>
						<When condition={(item as DirTree.Dir).children?.length}>
							<span className='children_count text_center'>
								{(item as DirTree.Dir).children?.length}
							</span>
						</When>
						<CaretRight
							className={$cx('icon_fold transition_normal', open && 'opened')}
							size={14}
							weight='bold'
						/>
					</div>
				</When>
			</Button>
		</Wave>
	)
}

export default $app.memo(Index)
