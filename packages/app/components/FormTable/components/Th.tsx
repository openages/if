import { useStyle } from '../hooks'

import type { IPropsTh } from '../types'

const Index = (props: IPropsTh) => {
	const { title, dataIndex, showSort, sort, align, fixed, stickyOffset, shadow, changeSort } = props
	const style = useStyle({ align, fixed, stickyOffset })

	return (
		<th
			className={$cx(
				'form_table_th',
				shadow && 'shadow',
				shadow && (shadow === 'start' ? 'shadow_start' : 'shadow_end'),
				showSort && 'showSort cursor_point',
				showSort && sort?.order && 'sorting'
			)}
			style={style}
			onClick={showSort ? () => changeSort(dataIndex) : undefined}
		>
			{showSort ? (
				<div className='align_center' style={{ display: 'inline-flex', align }}>
					<span>{title}</span>
					<div className='table_sort flex_column ml_6'>
						<span className={$cx('asc sort_item', sort?.order === 'asc' && 'active')}></span>
						<span className={$cx('desc sort_item', sort?.order === 'desc' && 'active')}></span>
					</div>
				</div>
			) : (
				title
			)}
		</th>
	)
}

export default $app.memo(Index)
