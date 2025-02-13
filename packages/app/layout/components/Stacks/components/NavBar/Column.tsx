import { ScrollMenu } from 'react-horizontal-scrolling-menu'

import { WinActions } from '@/layout/components'
import { is_mac_electron, is_win_electron, onWheel } from '@/utils'
import { useDroppable } from '@dnd-kit/core'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { House } from '@phosphor-icons/react'

import styles from './index.css'
import View from './View'

import type { IPropsStacksNavBarColumn } from '../../../../types'

const Index = (props: IPropsStacksNavBarColumn) => {
	const {
		column,
		column_index,
		show_homepage_btn,
		column_is_last,
		focus,
		resizing,
		click,
		remove,
		update,
		showHomepage
	} = props
	const { active, isOver, setNodeRef } = useDroppable({
		id: `nav_column_${column_index}`,
		data: { type: 'stack', column: column_index }
	})

	return (
		<div
			className={$cx(
				'border_box flex relative is_drag',
				styles.Column,
				resizing && styles.resizing,
				active?.data?.current?.column !== column_index && isOver && styles.isOver,
				is_mac_electron && show_homepage_btn && styles.mac_with_homepage
			)}
			style={{ width: `${column.width}%` }}
			ref={setNodeRef}
		>
			<If condition={show_homepage_btn!}>
				<div
					className='btn_homepage h_100 border_box flex justify_center align_center clickable no_drag'
					onClick={showHomepage}
				>
					<House></House>
				</div>
			</If>
			<SortableContext items={column.views} strategy={horizontalListSortingStrategy}>
				<ScrollMenu
					wrapperClassName={$cx(
						'scroll_wrap',
						show_homepage_btn && 'show_homepage_btn',
						is_mac_electron && 'is_mac_electron',
						is_win_electron && column_is_last && 'column_is_last'
					)}
					onWheel={onWheel}
				>
					{column.views.map((view, view_index) => (
						<View
							{...{ column_index, view_index, view, focus, click, remove, update }}
							key={view.id}
						></View>
					))}
				</ScrollMenu>
			</SortableContext>
			<If condition={is_win_electron && column_is_last!}>
				<WinActions></WinActions>
			</If>
		</div>
	)
}

export default $app.memo(Index)
