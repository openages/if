import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'

import { Emoji, LeftIcon, Wave } from '@/components'
import { CaretRight, Star } from '@phosphor-icons/react'

import type { IPropsDirItem_Item } from '../../../types'
import type { DirTree, Extend } from '@/types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsDirItem_Item) => {
	const {
		module,
		item,
		current_item,
		focusing_item,
		parent_index = [],
		dragging,
		open,
		star,
		showDirTreeOptions,
		onClick,
		onStar
	} = props
	const { id, name, type } = item

	const onItem = useMemoizedFn(() => onClick(item as DirTree.Item))
	const onContextMenu = useMemoizedFn(e => showDirTreeOptions(e, parent_index))
	const starFile = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()

		onStar(item.id)
	})

	return (
		<Wave>
			<Button
				className={$cx(
					'item_wrap w_100 border_box flex align_center relative cursor_point',
					type === 'file' && current_item.id === id && 'active',
					focusing_item.id === id && 'focusing',
					dragging && 'dragging'
				)}
				autoInsertSpace={false}
				style={{ paddingLeft: 9 * parent_index.length }}
				onClick={onItem}
				onContextMenu={onContextMenu}
			>
				<div className='left_icon_wrap flex justify_center align_center'>
					<Choose>
						<When condition={!!item.icon}>
							<Emoji shortcodes={item.icon!} size={16} hue={item.icon_hue}></Emoji>
						</When>
						<Otherwise>
							<LeftIcon module={module} item={item}></LeftIcon>
						</Otherwise>
					</Choose>
				</div>
				<div className='title_wrap flex align_center h_100 text_left'>{name}</div>
				{type === 'file' && (
					<div
						className={$cx(
							'star_icon_wrap align_center clickable ml_4',
							star ? 'star flex' : 'none'
						)}
						onClick={starFile}
					>
						<Star size={12} weight={star ? 'fill' : 'regular'} />
					</div>
				)}
				{type === 'dir' && (
					<div
						className={$cx(
							'right_icon_wrap flex align_center',
							type === 'dir' &&
								!(item as Extend.DirTree.TransformedItem)?.children?.length &&
								'no_children'
						)}
					>
						<If condition={(item as Extend.DirTree.TransformedItem)?.children?.length! > 0}>
							<span className='children_count text_center'>
								{(item as Extend.DirTree.TransformedItem)?.children?.length}
							</span>
						</If>
						<CaretRight
							className={$cx('icon_fold transition_normal', open && 'opened')}
							size={14}
							weight='bold'
						/>
					</div>
				)}
			</Button>
		</Wave>
	)
}

export default $app.memo(Index)
